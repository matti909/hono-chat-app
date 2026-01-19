export async function callClaudeAPI(data: object) {
  console.log("🔐 ANTHROPIC_API_KEY:", Bun.env.ANTHROPIC_API_KEY);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      "x-api-key": Bun.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
  });
  console.log("Claude request body:", JSON.stringify(data, null, 2));

  return res;
}
