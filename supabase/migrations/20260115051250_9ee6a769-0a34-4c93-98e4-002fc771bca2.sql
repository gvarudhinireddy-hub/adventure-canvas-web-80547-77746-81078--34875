-- Add policy to allow public access to shared trips that are marked as public and not expired
CREATE POLICY "Public can view public shared trips"
ON public.shared_trips
FOR SELECT
TO anon, authenticated
USING (
  is_public = true 
  AND (expires_at IS NULL OR expires_at > now())
);