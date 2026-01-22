import { HTTPException } from "hono/http-exception";
import { callClaudeAPI } from "./api";
import { validateClaudeResponse } from "./validation";

export async function getClaudeAnswer(data: object, apiKey: string) {
  try {
    const response = await callClaudeAPI(data, apiKey);
    const message = await validateClaudeResponse(response);
    return message;
  } catch {
    throw new HTTPException(503, { message: "Claude integration is down" });
  }
}
