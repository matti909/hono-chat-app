import type { DBMessage } from "../models/db";
import { getClaudeAnswer } from "./gpt";

export async function generateMessageResponse(
  messages: DBMessage[],
  apiKey: string,
): Promise<string> {
  const data = {
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: "You are a helpful AI assistant who answers to the user messages",
    messages: messages.map((m) => ({ role: m.type, content: m.message })),
  };

  return getClaudeAnswer(data, apiKey);
}
