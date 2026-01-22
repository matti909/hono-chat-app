export async function callClaudeAPI(data: object, apiKey: string) {
  console.log("🔐 ANTHROPIC_API_KEY:", apiKey ? "***" : "missing");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
  });
  console.log("Claude request body:", JSON.stringify(data, null, 2));

  return res;
}
