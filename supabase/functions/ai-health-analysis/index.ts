import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userMessage = "";

    if (type === "risk_prediction") {
      systemPrompt = `You are a health risk prediction AI. Given user health data, predict disease risks. Return ONLY valid JSON with this structure:
{
  "predictions": [
    { "disease": "string", "risk": number(0-100), "trend": "up"|"down"|"stable", "timeframe": "string", "explanation": "string" }
  ],
  "overall_health_score": number(0-100),
  "recommendations": ["string"]
}`;
      userMessage = `Analyze this health data and predict disease risks: ${JSON.stringify(data)}`;
    } else if (type === "health_twin") {
      systemPrompt = `You are an AI Health Twin simulator. Given user health data and lifestyle, simulate future health scenarios. Return ONLY valid JSON:
{
  "simulations": [
    { "scenario": "string", "prediction": "string", "severity": "success"|"warning"|"danger", "timeframe": "string" }
  ],
  "health_age": number,
  "biological_age_difference": number
}`;
      userMessage = `Simulate future health scenarios: ${JSON.stringify(data)}`;
    } else if (type === "mental_health") {
      systemPrompt = `You are a compassionate mental health AI assistant. Provide supportive, empathetic responses. Suggest coping strategies, mindfulness exercises, and when to seek professional help. Never diagnose or replace a therapist. Always be warm and understanding.`;
      userMessage = data.message;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("health analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
