import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Extract destination/place names from user query
function extractPlaceNames(text: string): string[] {
  // Common travel-related keywords to help identify destinations
  const places: string[] = [];
  
  // Match capitalized words that could be place names
  const capitalizedWords = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  places.push(...capitalizedWords);
  
  // Also try to extract after common phrases
  const patterns = [
    /(?:trip to|visit|travel to|going to|explore|in|about)\s+([A-Za-z\s]+?)(?:\s+on|\s+for|\s+with|[?.,]|$)/gi,
    /([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(?:itinerary|travel|trip|vacation|holiday)/gi,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].length > 2) {
        places.push(match[1].trim());
      }
    }
  }
  
  // Filter out common words that aren't places
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'what', 'where', 'when', 'how', 'why', 'best', 'good', 'great', 'nice', 'beautiful', 'amazing', 'wonderful', 'budget', 'cheap', 'expensive', 'luxury', 'affordable', 'day', 'days', 'week', 'weeks', 'month', 'trip', 'travel', 'vacation', 'holiday', 'itinerary', 'plan', 'suggest', 'recommend']);
  
  return [...new Set(places.filter(p => !commonWords.has(p.toLowerCase()) && p.length > 2))];
}

// Fetch images from Unsplash
async function fetchUnsplashImages(query: string, accessKey: string): Promise<{ url: string; alt: string; credit: string }[]> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + " travel")}&per_page=3&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );
    
    if (!response.ok) {
      console.error("Unsplash API error:", response.status);
      return [];
    }
    
    const data = await response.json();
    return data.results?.map((photo: any) => ({
      url: photo.urls?.regular || photo.urls?.small,
      alt: photo.alt_description || `${query} travel photo`,
      credit: photo.user?.name || "Unsplash",
    })) || [];
  } catch (error) {
    console.error("Unsplash fetch error:", error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Get the last user message for image search
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    const placeNames = extractPlaceNames(lastUserMessage);
    
    // Fetch images in parallel with AI response
    let imagesPromise: Promise<{ url: string; alt: string; credit: string }[]> = Promise.resolve([]);
    if (UNSPLASH_ACCESS_KEY && placeNames.length > 0) {
      imagesPromise = fetchUnsplashImages(placeNames[0], UNSPLASH_ACCESS_KEY);
    }

    const systemPrompt = `You are WanderNest AI Concierge, an expert travel assistant with access to current travel information.

IMPORTANT RESTRICTIONS:
- You ONLY help with travel-related queries. This includes destinations, itineraries, packing, accommodations, flights, local culture, food, safety, budgets, visas, weather, and transportation.
- If a user asks about ANYTHING unrelated to travel (math problems, coding, homework, general knowledge, jokes unrelated to travel, etc.), politely decline and redirect them to travel topics.
- Example response for off-topic queries: "I'm your dedicated travel concierge, so I specialize only in travel planning! Is there a destination you'd like to explore or a trip you're planning?"

WHAT YOU HELP WITH:
- Destination recommendations based on preferences, budget, and travel style
- Custom itinerary planning and adjustments
- Travel tips, safety advice, and local insights
- Activity suggestions and hidden gems
- Budget optimization and cost-saving tips
- Weather considerations and best times to visit
- Packing lists and travel gear recommendations
- Visa and documentation guidance
- Local customs and etiquette

RESPONSE STYLE:
- Always be friendly, helpful, and provide specific, actionable travel advice
- When suggesting destinations or activities, include practical details like estimated costs, duration, and insider tips
- Use emojis sparingly to make responses more engaging
- Format responses with clear sections when providing detailed information`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get images while streaming starts
    const images = await imagesPromise;
    
    // Create a transform stream to inject images at the end
    const originalBody = response.body!;
    const reader = originalBody.getReader();
    
    const stream = new ReadableStream({
      async start(controller) {
        // First, send images as a special event if available
        if (images.length > 0) {
          const imageEvent = `data: ${JSON.stringify({ type: "images", images })}\n\n`;
          controller.enqueue(new TextEncoder().encode(imageEvent));
        }
        
        // Then forward the AI response stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
