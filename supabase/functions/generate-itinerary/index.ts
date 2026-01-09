import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a professional travel itinerary formatter. Based on the conversation provided, extract and format a clean, professional travel itinerary.

OUTPUT FORMAT (use this exact structure):
---
DESTINATION: [Main destination(s)]
DURATION: [Number of days]
ESTIMATED BUDGET: [Budget range if mentioned, otherwise "To be determined"]

ITINERARY OVERVIEW
==================

DAY 1: [Title]
- Morning: [Activity with timing]
- Afternoon: [Activity with timing]  
- Evening: [Activity with timing]
- Accommodation: [If mentioned]
- Estimated cost: [If available]

[Continue for each day...]

IMPORTANT NOTES
===============
- [Key tips and recommendations]
- [Visa/documentation requirements if mentioned]
- [Best time to visit if mentioned]

PACKING ESSENTIALS
==================
- [Relevant items based on destination]

EMERGENCY CONTACTS
==================
- Local emergency: [If known for destination]
- Embassy: [If relevant]
---

If the conversation doesn't have enough details for a complete itinerary, create a basic template with the information available and mark missing sections as "To be planned".

Be concise but comprehensive. Focus on actionable, practical information.`;

    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please convert this travel planning conversation into a professional itinerary:\n\n${conversationText}` },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate itinerary");
    }

    const data = await response.json();
    const itineraryContent = data.choices?.[0]?.message?.content || "";

    // Extract destination and duration from the generated content
    const destinationMatch = itineraryContent.match(/DESTINATION:\s*(.+)/i);
    const durationMatch = itineraryContent.match(/DURATION:\s*(\d+)/i);
    const budgetMatch = itineraryContent.match(/ESTIMATED BUDGET:\s*(.+)/i);

    return new Response(
      JSON.stringify({
        itinerary: itineraryContent,
        destination: destinationMatch?.[1]?.trim() || "Travel Destination",
        duration: durationMatch?.[1] ? parseInt(durationMatch[1]) : null,
        budget: budgetMatch?.[1]?.trim() || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Generate itinerary error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
