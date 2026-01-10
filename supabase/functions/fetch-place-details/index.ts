import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { placeName } = await req.json();
    
    if (!placeName) {
      return new Response(
        JSON.stringify({ error: "Place name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not found");
      // Return basic info if no API key
      return new Response(
        JSON.stringify({
          name: placeName,
          country: "",
          description: `Discover the beauty of ${placeName}.`,
          bestSeason: "Year-round",
          topAttractions: [],
          currency: "",
          budgetLevel: "Varies",
          safetyTips: [],
          localTransport: [],
          overview: `${placeName} is a destination waiting to be explored. Ask our AI Concierge for personalized recommendations.`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Lovable AI to generate place details
    const prompt = `Generate travel information for "${placeName}" as a JSON object with these fields:
    - name: the place name
    - country: the country it's in
    - description: a brief 1-2 sentence description
    - bestSeason: best time to visit
    - topAttractions: array of 5-6 must-see attractions
    - currency: local currency
    - budgetLevel: "Low", "Medium", or "High"
    - safetyTips: array of 3-4 safety tips
    - localTransport: array of transportation options
    - overview: a 2-3 paragraph overview of the destination

    Return ONLY valid JSON, no markdown or extra text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a travel expert. Respond only with valid JSON, no markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("AI API error:", response.status);
      throw new Error("Failed to generate place details");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in response");
    }

    // Parse the JSON response
    let placeDetails;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      placeDetails = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return fallback data
      placeDetails = {
        name: placeName,
        country: "",
        description: `Explore ${placeName}, a unique destination.`,
        bestSeason: "Year-round",
        topAttractions: [],
        currency: "",
        budgetLevel: "Varies",
        safetyTips: [],
        localTransport: [],
        overview: `${placeName} offers unique experiences for travelers. Visit our AI Concierge for more detailed information.`
      };
    }

    return new Response(
      JSON.stringify(placeDetails),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        name: "",
        country: "",
        description: "",
        bestSeason: "Year-round",
        topAttractions: [],
        currency: "",
        budgetLevel: "Varies",
        safetyTips: [],
        localTransport: [],
        overview: ""
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
