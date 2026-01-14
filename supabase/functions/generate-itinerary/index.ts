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

    const systemPrompt = `You are a professional travel itinerary formatter creating PRD-style travel documents. Based on the conversation provided, extract and format a comprehensive, structured travel itinerary suitable for professional documentation.

OUTPUT FORMAT (use this exact structure with proper headings and sections):

================================================================================
                           TRAVEL ITINERARY DOCUMENT
================================================================================

1. EXECUTIVE SUMMARY
--------------------
• Destination: [Main destination(s)]
• Travel Dates: [Start date - End date, or "To be scheduled"]
• Duration: [Number of days/nights]
• Total Budget: [Budget range or "To be determined"]
• Travel Style: [Adventure/Relaxation/Cultural/Mixed]
• Travelers: [Number and type, e.g., "2 Adults, 1 Child" or "Solo traveler"]

2. TRIP OBJECTIVES
------------------
• Primary Goal: [Main purpose of the trip]
• Key Experiences: [List 3-5 must-do activities]
• Success Criteria: [What makes this trip successful]

3. DETAILED ITINERARY
---------------------

┌─────────────────────────────────────────────────────────────────────────────┐
│ DAY 1: [Day Title/Theme]                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Morning (08:00 - 12:00)                                                      │
│   • Activity: [Description]                                                  │
│   • Location: [Address/Area]                                                 │
│   • Duration: [Time needed]                                                  │
│   • Cost: [Estimated expense]                                                │
│                                                                              │
│ Afternoon (12:00 - 18:00)                                                    │
│   • Activity: [Description]                                                  │
│   • Location: [Address/Area]                                                 │
│   • Duration: [Time needed]                                                  │
│   • Cost: [Estimated expense]                                                │
│                                                                              │
│ Evening (18:00 - 22:00)                                                      │
│   • Activity: [Description]                                                  │
│   • Location: [Address/Area]                                                 │
│   • Duration: [Time needed]                                                  │
│   • Cost: [Estimated expense]                                                │
│                                                                              │
│ Accommodation: [Hotel/Hostel name and address]                               │
│ Daily Budget: [Total for the day]                                            │
└─────────────────────────────────────────────────────────────────────────────┘

[Continue for each day with the same format...]

4. BUDGET BREAKDOWN
-------------------
┌────────────────────┬─────────────────┐
│ Category           │ Estimated Cost  │
├────────────────────┼─────────────────┤
│ Flights/Transport  │ $XXX            │
│ Accommodation      │ $XXX            │
│ Food & Dining      │ $XXX            │
│ Activities/Tours   │ $XXX            │
│ Local Transport    │ $XXX            │
│ Shopping/Souvenirs │ $XXX            │
│ Emergency Fund     │ $XXX            │
├────────────────────┼─────────────────┤
│ TOTAL              │ $XXX            │
└────────────────────┴─────────────────┘

5. LOGISTICS & REQUIREMENTS
---------------------------
• Visa Requirements: [Details or "Not required"]
• Vaccinations: [Required/Recommended vaccines]
• Travel Insurance: [Recommended coverage]
• Currency: [Local currency and exchange tips]
• Language: [Official language and useful phrases]
• Best Time to Visit: [Optimal travel period]
• Weather Forecast: [Expected conditions]

6. PACKING CHECKLIST
--------------------
□ Documents: Passport, tickets, insurance, copies
□ Clothing: [Season-appropriate items]
□ Electronics: [Adapters, chargers, camera]
□ Health: [Medications, first aid, sunscreen]
□ Accessories: [Bags, comfort items]
□ Destination-specific: [Special items needed]

7. EMERGENCY INFORMATION
------------------------
• Local Emergency Number: [Number]
• Nearest Embassy/Consulate: [Address and phone]
• Travel Insurance Hotline: [Number]
• Hotel Emergency Contact: [Number]
• Local Police: [Number]
• Medical Emergency: [Number]

8. NOTES & RECOMMENDATIONS
--------------------------
• [Important tip 1]
• [Important tip 2]
• [Cultural considerations]
• [Safety tips]

================================================================================
                    Document Generated by WanderNest AI Concierge
================================================================================

If the conversation doesn't have enough details for a complete itinerary, create a template with available information and mark missing sections as "[To be planned]".

Be comprehensive, structured, and professional. This document should be ready to use as a travel planning reference.`;

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
