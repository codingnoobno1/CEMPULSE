// src/app/api/genai/route.js
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

export async function POST(request) {
  try {
    // 1. Verify JWT
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { role, allowed } = payload;

    // 2. Get user input
    const body = await request.json().catch(() => ({}));
    const { message, processes } = body;

    // If master role, allow all requested processes
    let requested = processes?.length ? processes : allowed;
    let unauthorized = [];

    if (role.toLowerCase() !== "master") {
      unauthorized = requested.filter((p) => !allowed.includes(p));
      if (unauthorized.length > 0) {
        return NextResponse.json(
          { error: `Unauthorized process access: ${unauthorized.join(", ")}` },
          { status: 403 }
        );
      }
    } else {
      // Master override → can see all processes
      requested = processes?.length ? processes : ["raw", "kiln", "clinker", "cement", "dispatch"];
    }

    // 3. Role-based prompting
    let prompt = `
You are acting as a **Cement Plant Master Advisor**.
Your role is: **${role}**.
You are primarily responsible for controlling and giving advice across these processes: ${requested.join(", ")}.

Guidelines:
- Provide **authoritative, management-level advice**.
- Be flexible: you may also comment on processes not strictly listed if it benefits factory health.
- If the user asks vague things like "how is my factory?", give a **diagnostic**:
   → Choose from: "Factory is operating at best efficiency",
   "Factory is in a critical state", or "Factory performance is suboptimal".
- Focus on **actionable recommendations** (what to adjust, monitor, or optimize).
- Avoid technical overloading — keep it practical and executive-style.
`;

    if (message) {
      prompt += `\nUser Question: ${message}`;
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing AI key" },
        { status: 500 }
      );
    }

    // 4. Call Gemini API
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API HTTP Error:", res.status, errText);
      return NextResponse.json(
        { error: `Gemini API returned status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // 5. Extract message
    const candidates = data.candidates || [];
    const suggestions =
      candidates.map((c) => ({
        message: c.content?.parts?.[0]?.text || "No content",
        severity: role.toLowerCase() === "master" ? "high" : "info",
      })) || [{ message: "No suggestions returned", severity: "info" }];

    return NextResponse.json({ role, processes: requested, suggestions });
  } catch (err) {
    console.error("GenAI Endpoint Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch AI insights" },
      { status: 500 }
    );
  }
}
