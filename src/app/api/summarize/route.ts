import { streamText } from "ai";
import type { NextRequest } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
  const { prompt } = (await request.json()) as { prompt: string };

  const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const promptText = `Summarize the following note content in a concise paragraph:\n\n${prompt}`;

  const response = streamText({
    model: googleAI("Gemini 3.1 Flash Lite"),
    prompt: promptText,
  });

  return response.toDataStreamResponse();
}
