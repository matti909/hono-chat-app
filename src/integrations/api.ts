export async function callGPTAPI(data: object) {
  console.log("🔐 OPENAI_API_KEY:", Bun.env.OPENAI_API_KEY);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + Bun.env.OPENAI_API_KEY,
    },
  });
  console.log("OpenAI request body:", JSON.stringify(data, null, 2));

  return res;
}
