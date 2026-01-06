"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, viewportSettings } from "@/lib/animations";
import { useI18n } from "@/lib/i18n";

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: { name: string; type: string }[];
  timestamp?: number;
  feedback?: "positive" | "negative" | null;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  summary?: string;
  summarizedUpTo?: number; // Index of last summarized message
}

interface FileData {
  data: string;
  mimeType: string;
  name: string;
}

// Constants
const LINKEDIN_URL = "https://www.linkedin.com/in/nicolas-steinberg-pro/";
const VIP_CODE = "steinberg-vip-member";
const QUOTA_DISCOVERY = 3;
const QUOTA_LINKEDIN = 20;

// Quick reply suggestions
const QUICK_REPLIES = {
  en: [
    "Analyze a negative review",
    "Write a response to a complaint",
    "Improve my service standards",
    "Train my team on guest experience"
  ],
  fr: [
    "Analyser un avis négatif",
    "Rédiger une réponse à une réclamation",
    "Améliorer mes standards de service",
    "Former mon équipe à l'expérience client"
  ]
};

// Format timestamp for display
const formatTimestamp = (timestamp: number, locale: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString(locale === "en" ? "en-US" : "fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  return date.toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Normalize typographic characters to ASCII equivalents
// Fixes issues with curly apostrophes and quotes from AI responses
const normalizeText = (text: string): string => {
  return text
    // Apostrophes: right single quote, left single quote, single high-reversed-9, prime, reversed prime
    .replace(/[\u2018\u2019\u201B\u2032\u2035]/g, "'")
    // Double quotes: left double, right double, double high-reversed-9
    .replace(/[\u201C\u201D\u201F]/g, '"')
    // Dashes: en-dash, em-dash to hyphen-minus
    .replace(/[\u2013\u2014]/g, "-")
    // Ellipsis to three dots
    .replace(/\u2026/g, "...");
};

// GA4 Tracking
const trackEvent = (eventName: string, params?: Record<string, string>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

// Quota Management
const getQuotaState = () => {
  if (typeof window === "undefined") return { count: 0, isVip: false, linkedinUnlocked: false };

  const today = new Date().toISOString().split("T")[0];
  const storedDate = localStorage.getItem("steinberg_msg_date");

  // Reset counter if new day
  if (storedDate !== today) {
    localStorage.setItem("steinberg_msg_date", today);
    localStorage.setItem("steinberg_msg_count", "0");
  }

  return {
    count: parseInt(localStorage.getItem("steinberg_msg_count") || "0", 10),
    isVip: localStorage.getItem("steinberg_vip_status") === "true",
    linkedinUnlocked: localStorage.getItem("steinberg_linkedin_unlocked") === "true",
  };
};

const incrementQuota = () => {
  const current = parseInt(localStorage.getItem("steinberg_msg_count") || "0", 10);
  localStorage.setItem("steinberg_msg_count", String(current + 1));
};

const unlockLinkedIn = () => {
  const current = parseInt(localStorage.getItem("steinberg_msg_count") || "0", 10);
  localStorage.setItem("steinberg_msg_count", String(Math.max(0, current - 17)));
  localStorage.setItem("steinberg_linkedin_unlocked", "true");
};

const clearChatHistory = () => {
  localStorage.removeItem("steinberg_chat_history");
  localStorage.removeItem("steinberg_chat_timestamp");
};

// Multi-conversation management
const CONVERSATIONS_KEY = "steinberg_conversations";
const ACTIVE_CONVERSATION_KEY = "steinberg_active_conversation";
const MAX_CONVERSATIONS = 10;

// Auto-summarization settings
const SUMMARY_THRESHOLD = 12; // Summarize when conversation exceeds this many messages
const RECENT_MESSAGES_COUNT = 6; // Keep this many recent messages unsummarized

const getConversations = (): Conversation[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CONVERSATIONS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
};

const getActiveConversationId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CONVERSATION_KEY);
};

const setActiveConversationId = (id: string) => {
  localStorage.setItem(ACTIVE_CONVERSATION_KEY, id);
};

const generateConversationTitle = (firstMessage: string, locale: string): string => {
  // Extract first ~30 chars of user message as title
  const truncated = firstMessage.slice(0, 40).trim();
  return truncated.length < firstMessage.length ? truncated + "..." : truncated;
};

const activateVip = () => {
  localStorage.setItem("steinberg_vip_status", "true");
};

export default function ChatInterface() {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipCode, setVipCode] = useState("");
  const [vipError, setVipError] = useState(false);
  const [quotaState, setQuotaState] = useState({ count: 0, isVip: false, linkedinUnlocked: false });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [summarizedUpTo, setSummarizedUpTo] = useState<number>(0);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create welcome message helper
  const createWelcomeMessage = useCallback((): Message => ({
    id: "welcome",
    role: "assistant",
    content: locale === "en"
      ? "Welcome. Excellence is not about stars, but about precision. I'm here to elevate your standards, whatever your reality.\n\nI can immediately:\n• 🛡️ Defuse a crisis or respond to a negative review.\n• 📝 Draft your procedures and sensitive emails.\n• 💡 Optimize your guests' experience.\n\nTo calibrate my analysis right now: What type of establishment do you work in? (Hotel, Restaurant, Independent, Franchise...)"
      : "Bienvenue. L'excellence n'est pas une question d'étoiles, mais de précision. Je suis là pour élever vos standards, quelle que soit votre réalité.\n\nJe peux immédiatement :\n• 🛡️ Désamorcer une crise ou répondre à un avis négatif.\n• 📝 Rédiger vos procédures et emails délicats.\n• 💡 Optimiser l'expérience de vos clients.\n\nPour calibrer mon analyse dès maintenant : Dans quel type d'établissement travaillez-vous ? (Hôtel, Restaurant, Indépendant, Franchise...)",
    timestamp: Date.now(),
  }), [locale]);

  // Initialize quota state and load conversations
  useEffect(() => {
    setQuotaState(getQuotaState());

    // Load all conversations
    const storedConversations = getConversations();
    const activeId = getActiveConversationId();

    // Clean up old conversations (older than 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const validConversations = storedConversations.filter(
      (conv) => conv.updatedAt > sevenDaysAgo
    );

    if (validConversations.length !== storedConversations.length) {
      saveConversations(validConversations);
    }

    setConversations(validConversations);

    // Find active conversation or create new one
    if (activeId && validConversations.find((c) => c.id === activeId)) {
      setActiveConversationIdState(activeId);
      const activeConv = validConversations.find((c) => c.id === activeId);
      if (activeConv) {
        setMessages(activeConv.messages);
        // Restore summary state if exists
        if (activeConv.summary) {
          setCurrentSummary(activeConv.summary);
          setSummarizedUpTo(activeConv.summarizedUpTo || 0);
        }
        return;
      }
    }

    // No active conversation, show welcome
    setMessages([createWelcomeMessage()]);
  }, [locale, createWelcomeMessage]);

  // Save messages to active conversation whenever they change
  useEffect(() => {
    // Only save if we have real messages (not just welcome)
    if (messages.length <= 1 && messages[0]?.id === "welcome") return;

    if (activeConversationId) {
      // Update existing conversation
      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages,
                updatedAt: Date.now(),
                summary: currentSummary || conv.summary,
                summarizedUpTo: summarizedUpTo || conv.summarizedUpTo,
              }
            : conv
        );
        saveConversations(updated);
        return updated;
      });
    } else {
      // Create new conversation when first real message is sent
      const firstUserMessage = messages.find((m) => m.role === "user");
      if (firstUserMessage) {
        const newConv: Conversation = {
          id: Date.now().toString(),
          title: generateConversationTitle(firstUserMessage.content, locale),
          messages,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setActiveConversationIdState(newConv.id);
        setActiveConversationId(newConv.id);

        setConversations((prev) => {
          // Limit to MAX_CONVERSATIONS
          const updated = [newConv, ...prev].slice(0, MAX_CONVERSATIONS);
          saveConversations(updated);
          return updated;
        });
      }
    }
  }, [messages, activeConversationId, locale, currentSummary, summarizedUpTo]);

  // Auto-scroll within chat container only (not the whole page)
  useEffect(() => {
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      const chatContainer = document.querySelector(".chat-messages");

      if (lastMessage.role === "user") {
        // User sent a message - scroll to bottom to see loading indicator
        setTimeout(() => {
          if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
          }
        }, 100);
      } else if (lastMessage.role === "assistant") {
        // AI responded - scroll to start of the response
        setTimeout(() => {
          const messageEl = document.getElementById(`msg-${lastMessage.id}`);
          if (messageEl && chatContainer) {
            const containerRect = chatContainer.getBoundingClientRect();
            const messageRect = messageEl.getBoundingClientRect();
            const scrollOffset = messageRect.top - containerRect.top + chatContainer.scrollTop;
            chatContainer.scrollTo({ top: scrollOffset, behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, [messages]);

  // Calculate remaining quota
  const getMaxQuota = () => {
    if (quotaState.isVip) return Infinity;
    return quotaState.linkedinUnlocked ? QUOTA_LINKEDIN : QUOTA_DISCOVERY;
  };

  const getRemainingQuota = () => {
    const max = getMaxQuota();
    if (max === Infinity) return Infinity;
    return Math.max(0, max - quotaState.count);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        alert(locale === "en" ? "File too large (max 4MB)" : "Fichier trop volumineux (max 4MB)");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setFiles((prev) => [
          ...prev,
          { data: base64, mimeType: file.type, name: file.name },
        ]);
        trackEvent("chat_file_attached", { file_type: file.type });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // Handle paste (Ctrl+V for images)
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setFiles((prev) => [
            ...prev,
            { data: base64, mimeType: file.type, name: `pasted-image-${Date.now()}.png` },
          ]);
          trackEvent("chat_file_attached", { file_type: file.type, method: "paste" });
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset chat - start a new conversation
  const resetChat = () => {
    setFiles([]);
    setInput("");
    setActiveConversationIdState(null);
    localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    setMessages([createWelcomeMessage()]);
    setCurrentSummary(null);
    setSummarizedUpTo(0);
    setShowSidebar(false);
    trackEvent("chat_reset");
  };

  // Switch to a different conversation
  const switchConversation = (convId: string) => {
    const conv = conversations.find((c) => c.id === convId);
    if (conv) {
      setActiveConversationIdState(convId);
      setActiveConversationId(convId);
      setMessages(conv.messages);
      // Load summary state
      setCurrentSummary(conv.summary || null);
      setSummarizedUpTo(conv.summarizedUpTo || 0);
      setShowSidebar(false);
      trackEvent("chat_switch_conversation");
    }
  };

  // Generate summary for old messages
  const summarizeOldMessages = async (messagesToSummarize: { role: string; content: string }[]): Promise<string | null> => {
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSummarize.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          locale,
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.summary || null;
    } catch (error) {
      console.error("Summarization error:", error);
      return null;
    }
  };

  // Delete a conversation
  const deleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== convId);
      saveConversations(updated);
      return updated;
    });

    // If deleting active conversation, reset
    if (convId === activeConversationId) {
      resetChat();
    }
    trackEvent("chat_delete_conversation");
  };

  // Start editing conversation title
  const startEditingConversation = (convId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(convId);
    setEditingTitle(currentTitle);
  };

  // Save renamed conversation
  const saveConversationTitle = (convId: string) => {
    if (!editingTitle.trim()) {
      setEditingConvId(null);
      return;
    }

    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === convId ? { ...c, title: editingTitle.trim() } : c
      );
      saveConversations(updated);
      return updated;
    });

    setEditingConvId(null);
    setEditingTitle("");
    trackEvent("chat_rename_conversation");
  };

  // Copy message to clipboard
  const copyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      trackEvent("chat_message_copied");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Set feedback on a message
  const setFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
          : msg
      )
    );
    trackEvent("chat_feedback", { feedback, message_id: messageId });
  };

  // Handle quick reply click
  const handleQuickReply = (reply: string) => {
    setInput(reply);
    inputRef.current?.focus();
    trackEvent("chat_quick_reply", { reply });
  };

  // Export conversation
  const exportConversation = (format: "txt" | "json") => {
    const exportData = messages.filter((m) => m.id !== "welcome");
    let content: string;
    let filename: string;
    let type: string;

    if (format === "txt") {
      content = exportData
        .map((m) => {
          const time = m.timestamp ? formatTimestamp(m.timestamp, locale) : "";
          const role = m.role === "user" ? (locale === "en" ? "You" : "Vous") : "Steinberg";
          return `[${time}] ${role}:\n${m.content}\n`;
        })
        .join("\n---\n\n");
      filename = `steinberg-chat-${new Date().toISOString().split("T")[0]}.txt`;
      type = "text/plain";
    } else {
      content = JSON.stringify(exportData, null, 2);
      filename = `steinberg-chat-${new Date().toISOString().split("T")[0]}.json`;
      type = "application/json";
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("chat_exported", { format });
  };

  // Filter messages for search
  const filteredMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Send message
  const sendMessage = async () => {
    if ((!input.trim() && files.length === 0) || isLoading) return;

    // Check quota
    const state = getQuotaState();
    setQuotaState(state);

    if (!state.isVip) {
      const max = state.linkedinUnlocked ? QUOTA_LINKEDIN : QUOTA_DISCOVERY;
      if (state.count >= max) {
        setShowLinkedInModal(true);
        trackEvent("linkedin_gate_shown");
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      files: files.map((f) => ({ name: f.name, type: f.mimeType })),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const currentFiles = [...files];
    setFiles([]);
    setIsLoading(true);

    // Track message sent
    trackEvent("chat_message_sent", {
      has_files: String(currentFiles.length > 0),
      message_length: String(input.length),
    });

    // Create placeholder message for streaming
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Build history context with potential summarization
      let historyContext: { role: string; content: string }[] = [];
      let newSummary = currentSummary;
      let newSummarizedUpTo = summarizedUpTo;

      // Check if we need to summarize (conversation is getting long)
      const totalMessages = messages.length;
      const unsummarizedCount = totalMessages - summarizedUpTo;

      if (unsummarizedCount > SUMMARY_THRESHOLD && totalMessages > SUMMARY_THRESHOLD) {
        // Need to summarize older messages
        const messagesToSummarize = messages.slice(
          summarizedUpTo,
          totalMessages - RECENT_MESSAGES_COUNT
        );

        if (messagesToSummarize.length > 0) {
          // Combine old summary with new messages to summarize
          const contextToSummarize = currentSummary
            ? [{ role: "system" as const, content: `Résumé précédent: ${currentSummary}` }, ...messagesToSummarize]
            : messagesToSummarize;

          const summary = await summarizeOldMessages(contextToSummarize);
          if (summary) {
            newSummary = summary;
            newSummarizedUpTo = totalMessages - RECENT_MESSAGES_COUNT;
            setCurrentSummary(summary);
            setSummarizedUpTo(newSummarizedUpTo);
            trackEvent("chat_summarized", { messages_count: String(messagesToSummarize.length) });
          }
        }
      }

      // Build history: summary (if exists) + recent messages
      if (newSummary) {
        historyContext.push({
          role: "system",
          content: `[Résumé de la conversation précédente: ${newSummary}]`,
        });
      }

      // Add recent messages (after summarized portion)
      const recentMessages = messages.slice(Math.max(0, newSummarizedUpTo));
      historyContext.push(
        ...recentMessages.map((m) => ({ role: m.role, content: m.content }))
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          files: currentFiles,
          locale,
          history: historyContext.slice(-12), // Limit to prevent token overflow
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur API");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = ""; // Buffer for incomplete SSE lines

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Process complete lines only
          const lines = buffer.split("\n");
          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullContent += parsed.text;
                  // Update message content progressively
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: normalizeText(fullContent) }
                        : msg
                    )
                  );
                }
              } catch {
                // Skip malformed JSON - might be empty line
              }
            }
          }
        }

        // Process any remaining data in buffer
        if (buffer.startsWith("data: ")) {
          const data = buffer.slice(6).trim();
          if (data && data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullContent += parsed.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: normalizeText(fullContent) }
                      : msg
                  )
                );
              }
            } catch {
              // Final buffer wasn't valid JSON
            }
          }
        }
      }

      // Increment quota only on success
      if (!state.isVip) {
        incrementQuota();
        setQuotaState(getQuotaState());
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Update the placeholder message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: locale === "en"
                  ? "An error occurred during analysis. Please try again."
                  : "Une erreur est survenue lors de l'analyse. Veuillez réessayer.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle LinkedIn click
  const handleLinkedInClick = () => {
    unlockLinkedIn();
    setQuotaState(getQuotaState());
    setShowLinkedInModal(false);
    trackEvent("linkedin_gate_clicked");

    // Open LinkedIn
    window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer");
  };

  // Handle VIP code
  const handleVipSubmit = () => {
    if (vipCode.toLowerCase() === VIP_CODE) {
      activateVip();
      setQuotaState(getQuotaState());
      setShowVipModal(false);
      setVipCode("");
      trackEvent("vip_access_granted");
    } else {
      setVipError(true);
      setTimeout(() => setVipError(false), 500);
    }
  };

  const remaining = getRemainingQuota();

  return (
    <section id="steinberg-hospitality-analytics" className="section relative">
      {/* Marble Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/marble-calacatta.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        className="container-narrow relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <span className="inline-block text-brass text-xs md:text-sm tracking-[0.3em] uppercase mb-6">
            {locale === "en" ? "STRATEGIC INTELLIGENCE" : "INTELLIGENCE STRATÉGIQUE"}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-paper mb-6">
            Steinberg Hospitality Analytics
          </h2>
          <p className="max-w-2xl mx-auto text-paper-muted leading-relaxed">
            {locale === "en"
              ? "Strategic intelligence for Hospitality, Restaurants & Retail. From 2-star to Palace: Instantly get your responses written (Reviews, Emails) and your operational strategies. Submit a situation: receive a surgical deliverable calibrated to your reality."
              : "L'intelligence stratégique pour Hôtellerie, Restauration & Retail. Du 2 étoiles au Palace : Obtenez instantanément la rédaction de vos réponses (Avis, Emails) et vos stratégies opérationnelles. Soumettez une situation : recevez un livrable chirurgical calibré sur votre réalité."}
          </p>
        </motion.div>

        {/* Chat Container - Accordion style */}
        <motion.div
          variants={fadeInUp}
          className="chat-container relative overflow-hidden"
          style={{
            maxHeight: isExpanded ? "950px" : "680px",
            transition: "max-height 0.5s ease-out",
          }}
        >
          {/* Conversations Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-obsidian/80 z-20"
                  onClick={() => setShowSidebar(false)}
                />
                {/* Sidebar Panel */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute left-0 top-0 bottom-0 w-64 bg-obsidian border-r border-brass/20 z-30 flex flex-col"
                >
                  {/* Sidebar Header */}
                  <div className="p-4 border-b border-brass/20 flex items-center justify-between">
                    <h4 className="text-paper font-medium text-sm">
                      {locale === "en" ? "Conversations" : "Conversations"}
                    </h4>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-1 rounded hover:bg-paper/10 transition-colors"
                    >
                      <svg className="w-5 h-5 text-paper-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* New Chat Button */}
                  <button
                    onClick={resetChat}
                    className="m-3 px-4 py-2 rounded-lg border border-brass/30 text-brass hover:bg-brass/10 transition-colors text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {locale === "en" ? "New Chat" : "Nouveau Chat"}
                  </button>

                  {/* Conversations List */}
                  <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                      <p className="text-paper-muted/50 text-xs text-center py-8 px-4">
                        {locale === "en" ? "No conversations yet" : "Aucune conversation"}
                      </p>
                    ) : (
                      conversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => editingConvId !== conv.id && switchConversation(conv.id)}
                          className={`group px-4 py-3 cursor-pointer hover:bg-paper/5 transition-colors border-b border-brass/10 ${
                            conv.id === activeConversationId ? "bg-brass/10" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {editingConvId === conv.id ? (
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onBlur={() => saveConversationTitle(conv.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveConversationTitle(conv.id);
                                    if (e.key === "Escape") setEditingConvId(null);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  autoFocus
                                  className="w-full bg-paper/10 text-paper text-sm px-2 py-1 rounded border border-brass/30 focus:border-brass focus:outline-none"
                                />
                              ) : (
                                <p className="text-paper text-sm truncate">{conv.title}</p>
                              )}
                              <p className="text-paper-muted/50 text-xs mt-0.5">
                                {formatTimestamp(conv.updatedAt, locale)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {/* Rename button */}
                              <button
                                onClick={(e) => startEditingConversation(conv.id, conv.title, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-paper/10 transition-all"
                                title={locale === "en" ? "Rename" : "Renommer"}
                              >
                                <svg className="w-4 h-4 text-paper-muted hover:text-brass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              {/* Delete button */}
                              <button
                                onClick={(e) => deleteConversation(conv.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
                                title={locale === "en" ? "Delete" : "Supprimer"}
                              >
                                <svg className="w-4 h-4 text-paper-muted hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-brass/20 text-center">
                    <p className="text-paper-muted/40 text-xs">
                      {conversations.length}/{MAX_CONVERSATIONS} {locale === "en" ? "saved" : "sauvegardées"}
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Chat Header */}
          <div className="chat-header">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle - only show if there are conversations */}
              {conversations.length > 0 && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 -ml-2 rounded-lg hover:bg-paper/10 transition-colors"
                  title={locale === "en" ? "Conversations" : "Conversations"}
                >
                  <svg className="w-5 h-5 text-paper-muted hover:text-paper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center border border-brass/30">
                <span className="font-serif text-brass text-lg">S</span>
              </div>
              <div>
                <h3 className="text-paper font-medium text-sm">Steinberg Hospitality Analytics</h3>
                <span className="text-paper-muted text-xs">
                  {locale === "en" ? "Strategic Analyst" : "Analyste Stratégique"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {quotaState.isVip && (
                <div className="flex items-center gap-2 text-brass text-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>VIP</span>
                </div>
              )}
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-lg hover:bg-paper/10 transition-colors ${showSearch ? "bg-paper/10" : ""}`}
                title={locale === "en" ? "Search" : "Rechercher"}
              >
                <svg className="w-4 h-4 text-paper-muted hover:text-paper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {/* Export Button */}
              <button
                onClick={() => exportConversation("txt")}
                disabled={messages.length <= 1}
                className="p-2 rounded-lg hover:bg-paper/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={locale === "en" ? "Export conversation" : "Exporter la conversation"}
              >
                <svg className="w-4 h-4 text-paper-muted hover:text-paper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              {/* New Chat Button */}
              <button
                onClick={resetChat}
                disabled={isLoading || messages.length <= 1}
                className="p-2 rounded-lg hover:bg-paper/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={locale === "en" ? "New conversation" : "Nouvelle conversation"}
              >
                <svg className="w-4 h-4 text-paper-muted hover:text-paper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="px-4 py-2 border-b border-brass/20">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === "en" ? "Search in conversation..." : "Rechercher dans la conversation..."}
                  className="w-full bg-obsidian/50 border border-brass/20 rounded-lg px-3 py-2 text-sm text-paper placeholder-paper-muted/50 focus:outline-none focus:border-brass/40"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-paper-muted hover:text-paper"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-xs text-paper-muted mt-1">
                  {filteredMessages.length} {locale === "en" ? "result(s)" : "résultat(s)"}
                </p>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="chat-messages">
            {filteredMessages
              .filter((msg) => !(isLoading && msg.role === "assistant" && msg.content === ""))
              .map((msg) => (
              <div
                key={msg.id}
                id={`msg-${msg.id}`}
                className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"} group`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center border border-brass/30 flex-shrink-0 mr-3">
                    <span className="font-serif text-brass text-xs">S</span>
                  </div>
                )}
                <div className="flex-1">
                  {msg.files && msg.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {msg.files.map((f, i) => (
                        <span key={i} className="text-xs bg-brass/20 text-brass px-2 py-1 rounded">
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="chat-content whitespace-pre-wrap">{msg.content}</div>
                  {/* Message footer: timestamp + actions */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-brass/10">
                    {/* Timestamp */}
                    <span className="text-[10px] text-paper-muted/50">
                      {msg.timestamp ? formatTimestamp(msg.timestamp, locale) : ""}
                    </span>
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Copy button */}
                      <button
                        onClick={() => copyMessage(msg.content, msg.id)}
                        className="p-1 rounded hover:bg-paper/10 transition-colors"
                        title={locale === "en" ? "Copy" : "Copier"}
                      >
                        {copiedId === msg.id ? (
                          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-paper-muted hover:text-paper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                      {/* Feedback buttons (only for assistant messages, not welcome) */}
                      {msg.role === "assistant" && msg.id !== "welcome" && (
                        <>
                          <button
                            onClick={() => setFeedback(msg.id, "positive")}
                            className={`p-1 rounded hover:bg-paper/10 transition-colors ${msg.feedback === "positive" ? "text-green-400" : "text-paper-muted hover:text-paper"}`}
                            title={locale === "en" ? "Helpful" : "Utile"}
                          >
                            <svg className="w-3.5 h-3.5" fill={msg.feedback === "positive" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setFeedback(msg.id, "negative")}
                            className={`p-1 rounded hover:bg-paper/10 transition-colors ${msg.feedback === "negative" ? "text-red-400" : "text-paper-muted hover:text-paper"}`}
                            title={locale === "en" ? "Not helpful" : "Pas utile"}
                          >
                            <svg className="w-3.5 h-3.5" fill={msg.feedback === "negative" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Show typing indicator only when loading AND last message is empty (stream starting) */}
            {isLoading && messages.length > 0 && messages[messages.length - 1].content === "" && (
              <div className="chat-bubble chat-bubble-assistant">
                <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center border border-brass/30 flex-shrink-0 mr-3">
                  <span className="font-serif text-brass text-xs">S</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-brass/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-brass/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-brass/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-paper-muted/50">
                    {locale === "en" ? "Analyzing..." : "Analyse en cours..."}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies - Show only when there's just the welcome message */}
          {messages.length === 1 && messages[0].id === "welcome" && !isLoading && (
            <div className="px-4 py-3 border-t border-brass/20">
              <p className="text-xs text-paper-muted/60 mb-2">
                {locale === "en" ? "Quick suggestions:" : "Suggestions rapides :"}
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES[locale === "en" ? "en" : "fr"].map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs px-3 py-1.5 rounded-full border border-brass/30 text-paper-muted hover:text-paper hover:border-brass/50 hover:bg-brass/10 transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* File Preview */}
          {files.length > 0 && (
            <div className="px-4 py-2 border-t border-brass/20 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-brass/10 text-brass text-xs px-3 py-1.5 rounded">
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="hover:text-paper transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-brass/60 hover:text-brass transition-colors p-2"
              title={locale === "en" ? "Attach file" : "Joindre un fichier"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={locale === "en"
                ? "Describe a situation, upload a screenshot or an audit..."
                : "Décrivez une situation, joignez une capture d'écran ou un audit..."}
              className="chat-input"
              rows={2}
              style={{ resize: "none", overflow: "hidden", minHeight: "44px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && files.length === 0)}
              className="text-brass hover:text-paper disabled:text-paper-muted/30 transition-colors p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          {/* Footer - only show for non-VIP users */}
          {!quotaState.isVip && (
            <div className="chat-footer">
              <span className="text-paper-muted/60 text-xs">
                {remaining === Infinity
                  ? ""
                  : `${Math.max(0, QUOTA_LINKEDIN - quotaState.count)}/${QUOTA_LINKEDIN} ${locale === "en" ? "analyses remaining - resets every 24h" : "analyses restantes - reinitialise toutes les 24h"}`}
              </span>
              <button
                onClick={() => setShowVipModal(true)}
                className="text-paper-muted/40 hover:text-brass text-xs transition-colors"
              >
                {locale === "en" ? "Partner Access" : "Accès Partenaire"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* LinkedIn Modal */}
      <AnimatePresence>
        {showLinkedInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-sm"
            onClick={() => setShowLinkedInModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-900 flex items-center justify-center border border-brass">
                <span className="font-serif text-brass text-2xl">S</span>
              </div>
              <h3 className="font-serif text-2xl text-paper text-center mb-4">
                {locale === "en" ? "Join the Network" : "Rejoignez le Réseau"}
              </h3>
              <p className="text-paper-muted text-center text-sm leading-relaxed mb-8">
                {locale === "en"
                  ? "Access to analysis is reserved for my professional network. Visit my LinkedIn profile to instantly unlock your Premium quota (20 analyses/day)."
                  : "L'accès à l'analyse est réservé à mon réseau professionnel. Visitez mon profil LinkedIn pour débloquer instantanément votre quota Premium (20 analyses/jour)."}
              </p>
              <button
                onClick={handleLinkedInClick}
                className="w-full btn-primary flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>{locale === "en" ? "FOLLOW ON LINKEDIN" : "SUIVRE SUR LINKEDIN"}</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIP Modal */}
      <AnimatePresence>
        {showVipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-sm"
            onClick={() => setShowVipModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`modal-card ${vipError ? "animate-shake" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-paper text-center mb-2">
                {locale === "en" ? "Reserved Partner Access" : "Accès Réservé aux Partenaires"}
              </h3>
              <p className="text-paper-muted text-center text-sm mb-6">
                {locale === "en" ? "Enter your member code." : "Entrez votre code de membre."}
              </p>
              <input
                type="text"
                value={vipCode}
                onChange={(e) => setVipCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVipSubmit()}
                placeholder="XXXX-XXXX-XXXX"
                className="vip-input"
                autoFocus
              />
              {vipError && (
                <p className="text-red-400 text-xs text-center mt-2">
                  {locale === "en" ? "Key not recognized" : "Clé non reconnue"}
                </p>
              )}
              <button onClick={handleVipSubmit} className="w-full btn-ghost mt-4">
                {locale === "en" ? "VALIDATE" : "VALIDER"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Extend Window for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, string | number | boolean>) => void;
  }
}
