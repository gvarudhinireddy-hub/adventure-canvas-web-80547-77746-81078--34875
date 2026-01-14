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
    console.log("[fetch-place-images] Received query:", query);
    
    if (!query) {
      console.error("[fetch-place-images] Query is required but not provided");
      return new Response(
        JSON.stringify({ error: "Query is required", images: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY");
    console.log("[fetch-place-images] UNSPLASH_ACCESS_KEY configured:", !!UNSPLASH_ACCESS_KEY);

    if (!UNSPLASH_ACCESS_KEY) {
      console.error("[fetch-place-images] UNSPLASH_ACCESS_KEY not configured");
      // Return empty array - no fallback images per requirements
      return new Response(JSON.stringify({ images: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the Unsplash API URL with client_id as query parameter (NOT Authorization header)
    const searchQuery = encodeURIComponent(`${query} travel`);
    const searchUrl = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=10&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    console.log("[fetch-place-images] Fetching from Unsplash API...");
    console.log("[fetch-place-images] Search URL (without key):", searchUrl.replace(UNSPLASH_ACCESS_KEY, "***"));

    const response = await fetch(searchUrl);
    
    console.log("[fetch-place-images] Unsplash API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[fetch-place-images] Unsplash API error:", response.status, errorText);
      // Return empty array on API error - no fallback images per requirements
      return new Response(JSON.stringify({ images: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("[fetch-place-images] Unsplash API response - total results:", data.total);
    console.log("[fetch-place-images] Results array length:", data.results?.length || 0);

    // Safely extract images from results[0].urls.small
    const images = Array.isArray(data?.results) && data.results.length > 0
      ? data.results.map((photo: any) => {
          // Extract from results[0].urls.small as specified
          const imageUrl = photo?.urls?.small || photo?.urls?.regular || photo?.urls?.thumb;
          console.log("[fetch-place-images] Extracted image URL:", imageUrl);
          
          return {
            // Ensure HTTPS
            url: imageUrl ? imageUrl.replace(/^http:/, 'https:') : null,
            alt: photo?.alt_description || `${query} travel photo`,
            photographer: photo?.user?.name || "Unsplash",
            photographerUrl: photo?.user?.links?.html || "https://unsplash.com",
          };
        }).filter((img: any) => img.url) // Filter out any with null URLs
      : [];

    console.log("[fetch-place-images] Final images count:", images.length);

    // Return images array (empty if no results - NO fallback images)
    return new Response(JSON.stringify({ images }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[fetch-place-images] Error:", errorMessage);
    
    // Return empty array on error - no fallback images per requirements
    return new Response(
      JSON.stringify({ error: errorMessage, images: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
