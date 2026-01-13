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
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY");

    const fallbackImages = [
      {
        // Unsplash "Source" endpoint (no API key required) as a last-resort fallback
        url: `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)},travel`,
        alt: `${query} travel photo`,
        photographer: "Unsplash",
        photographerUrl: "https://unsplash.com",
      },
    ];

    if (!UNSPLASH_ACCESS_KEY) {
      console.error("UNSPLASH_ACCESS_KEY not configured");
      return new Response(JSON.stringify({ images: fallbackImages }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch images from Unsplash
    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query + " travel"
    )}&per_page=10&orientation=landscape`;

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      console.error("Unsplash API error:", response.status);
      return new Response(JSON.stringify({ images: fallbackImages }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    const images = Array.isArray(data?.results)
      ? data.results.map((photo: any) => ({
          url: photo?.urls?.regular,
          alt: photo?.alt_description || `${query} travel photo`,
          photographer: photo?.user?.name || "Unsplash",
          photographerUrl: photo?.user?.links?.html || "https://unsplash.com",
        }))
      : [];

    return new Response(JSON.stringify({ images: images.length ? images : fallbackImages }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, images: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
