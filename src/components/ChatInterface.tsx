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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize quota state and load chat history or welcome message
  useEffect(() => {
    setQuotaState(getQuotaState());

    // Check for existing chat history (valid for 24 hours)
    const storedHistory = localStorage.getItem("steinberg_chat_history");
    const storedTimestamp = localStorage.getItem("steinberg_chat_timestamp");

    if (storedHistory && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      // If history is less than 24 hours old, restore it
      if (now - timestamp < twentyFourHours) {
        try {
          const history = JSON.parse(storedHistory) as Message[];
          if (history.length > 0) {
            setMessages(history);
            return;
          }
        } catch {
          // Invalid JSON, clear and show welcome
          localStorage.removeItem("steinberg_chat_history");
          localStorage.removeItem("steinberg_chat_timestamp");
        }
      } else {
        // History expired, clear it
        localStorage.removeItem("steinberg_chat_history");
        localStorage.removeItem("steinberg_chat_timestamp");
      }
    }

    // No valid history, show welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: locale === "en"
        ? "Welcome. I am your strategic analyst. My methodology: facts over interpretation. We process data to restore the precision of your Palace standards. How may I assist you?"
        : "Bienvenue. Je suis votre analyste stratégique. Ma méthodologie : le fait contre l'interprétation. Ici, nous traitons des données pour restaurer la précision de vos standards Palace. Comment puis-je vous assister ?",
    };
    setMessages([welcomeMessage]);
  }, [locale]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && messages[0].id !== "welcome" || messages.length > 1) {
      localStorage.setItem("steinberg_chat_history", JSON.stringify(messages));
      localStorage.setItem("steinberg_chat_timestamp", Date.now().toString());
    }
  }, [messages]);

  // Auto-scroll within chat container only (not the whole page)
  useEffect(() => {
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      // Only scroll for assistant responses
      if (lastMessage.role === "assistant") {
        setTimeout(() => {
          const messageEl = document.getElementById(`msg-${lastMessage.id}`);
          const chatContainer = document.querySelector(".chat-messages");
          if (messageEl && chatContainer) {
            // Scroll within the chat container, not the whole page
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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          files: currentFiles,
          locale,
          history: messages.slice(-10), // Last 10 messages for context
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur API");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Increment quota only on success
      if (!state.isVip) {
        incrementQuota();
        setQuotaState(getQuotaState());
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: locale === "en"
          ? "An error occurred during analysis. Please try again."
          : "Une erreur est survenue lors de l'analyse. Veuillez réessayer.",
      };
      setMessages((prev) => [...prev, errorMessage]);
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
              ? "Predictive analytics and hospitality operational excellence interface. Eliminate interpretation, restore facts. Submit a case, receive a surgical strategy aligned with Palace standards."
              : "Interface d'analyse prédictive et d'excellence opérationnelle hôtelière. Éliminez l'interprétation, restaurez les faits. Soumettez une problématique, obtenez une stratégie chirurgicale alignée sur les standards Palace."}
          </p>
        </motion.div>

        {/* Chat Container - Accordion style */}
        <motion.div
          variants={fadeInUp}
          className="chat-container"
          style={{
            maxHeight: isExpanded ? "700px" : "500px",
            transition: "max-height 0.5s ease-out",
          }}
        >
          {/* Chat Header */}
          <div className="chat-header">
            <div className="flex items-center gap-3">
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
            {quotaState.isVip && (
              <div className="flex items-center gap-2 text-brass text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>VIP</span>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                id={`msg-${msg.id}`}
                className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}`}
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
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble chat-bubble-assistant">
                <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center border border-brass/30 flex-shrink-0 mr-3">
                  <span className="font-serif text-brass text-xs">S</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-brass/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-brass/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-brass/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

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

          {/* Footer */}
          <div className="chat-footer">
            {!quotaState.isVip && (
              <span className="text-paper-muted/60 text-xs">
                {remaining === Infinity
                  ? ""
                  : `${Math.max(0, QUOTA_LINKEDIN - quotaState.count)}/${QUOTA_LINKEDIN} ${locale === "en" ? "analyses remaining" : "analyses restantes"}`}
              </span>
            )}
            <button
              onClick={() => setShowVipModal(true)}
              className="text-paper-muted/40 hover:text-brass text-xs transition-colors"
            >
              {locale === "en" ? "Partner Access" : "Accès Partenaire"}
            </button>
          </div>
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
