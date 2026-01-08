-- Drop the overly permissive policy that exposes all public shares
DROP POLICY IF EXISTS "Anyone can view public shares by token" ON public.shared_trips;

-- Create a security definer function to get shared trip by token
-- This prevents enumeration of all public shares
CREATE OR REPLACE FUNCTION public.get_shared_trip_by_token(token text)
RETURNS TABLE (
  trip_id uuid,
  is_public boolean,
  expires_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT st.trip_id, st.is_public, st.expires_at
  FROM public.shared_trips st
  WHERE st.share_token = token
    AND st.is_public = true
    AND (st.expires_at IS NULL OR st.expires_at > now())
$$;

-- Create a security definer function to get trip details for sharing
CREATE OR REPLACE FUNCTION public.get_trip_for_sharing(p_trip_id uuid)
RETURNS TABLE (
  id uuid,
  destination_name text,
  destination_country text,
  destination_image text,
  start_date date,
  end_date date,
  notes text,
  budget numeric,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.destination_name, t.destination_country, t.destination_image,
         t.start_date, t.end_date, t.notes, t.budget, t.status
  FROM public.saved_trips t
  WHERE t.id = p_trip_id
$$;