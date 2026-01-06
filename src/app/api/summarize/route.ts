import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SUMMARY_PROMPT = `Tu es un assistant qui résume des conversations.
Résume cette conversation de manière concise en gardant :
- Les informations clés sur l'établissement/contexte mentionné
- Les problèmes/situations discutés
- Les conseils importants donnés
- Les décisions prises

Résumé en 3-5 phrases maximum, en français. Ne commence pas par "Voici le résumé" ou similaire, donne directement le résumé.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, locale } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages requis" },
        { status: 400 }
      );
    }

    // Get the model - use Flash for fast summarization
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    });

    // Format messages for summarization
    const conversationText = messages
      .map((msg: { role: string; content: string }) =>
        `${msg.role === "user" ? "Utilisateur" : "Analyste"}: ${msg.content}`
      )
      .join("\n\n");

    const prompt = `${SUMMARY_PROMPT}\n\nConversation à résumer:\n${conversationText}`;

    // Generate summary
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({
      summary,
      messagesCount: messages.length,
    });
  } catch (error) {
    console.error("Summarize API Error:", error);
    return NextResponse.json(
      { error: "Erreur lors du résumé" },
      { status: 500 }
    );
  }
}
