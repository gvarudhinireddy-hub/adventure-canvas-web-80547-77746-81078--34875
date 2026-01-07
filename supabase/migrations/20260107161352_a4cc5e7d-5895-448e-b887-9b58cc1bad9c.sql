-- Create shared_trips table for shareable links
CREATE TABLE public.shared_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.saved_trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_public BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shared_trips ENABLE ROW LEVEL SECURITY;

-- Owner can manage their shares
CREATE POLICY "Users can view their own shares" 
ON public.shared_trips FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create shares for their trips" 
ON public.shared_trips FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shares" 
ON public.shared_trips FOR DELETE 
USING (auth.uid() = user_id);

-- Anyone can view public shares via token (for the public page)
CREATE POLICY "Anyone can view public shares by token" 
ON public.shared_trips FOR SELECT 
USING (is_public = true);

-- Create index for fast token lookups
CREATE INDEX idx_shared_trips_token ON public.shared_trips(share_token);