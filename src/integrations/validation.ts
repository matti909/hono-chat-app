import { z } from "zod";

const ClaudeResponseSchema = z.object({
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    }),
  ),
});

export async function validateClaudeResponse(response: Response): Promise<string> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Claude error:", response.status, errorText);
    throw new Error("Invalid response from Claude");
  }

  const responseData = await response.json();

  try {
    const parsed = ClaudeResponseSchema.parse(responseData);
    const content = parsed.content[0].text.trim();
    return content;
  } catch (error) {
    throw new Error(`Invalid API response format: ${error}`);
  }
}
