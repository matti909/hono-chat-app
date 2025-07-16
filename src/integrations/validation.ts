import { z } from "zod";

const GPTResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    }),
  ),
});

export async function validateGPTResponse(response: Response): Promise<string> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI error:", response.status, errorText);
    throw new Error("Invalid response from OpenAI");
  }

  const responseData = await response.json();

  try {
    const parsed = GPTResponseSchema.parse(responseData);
    const content = parsed.choices[0].message.content.trim();
    return content;
  } catch (error) {
    throw new Error(`Invalid API response format: ${error}`);
  }
}
