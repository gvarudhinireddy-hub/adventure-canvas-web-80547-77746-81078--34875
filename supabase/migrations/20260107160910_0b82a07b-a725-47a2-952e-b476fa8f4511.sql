-- Create trip_history table for backup/audit trail
CREATE TABLE public.trip_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL,
  user_id UUID NOT NULL,
  destination_name TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  destination_image TEXT,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  budget NUMERIC,
  status TEXT DEFAULT 'planned',
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted'
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trip_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own trip history" 
ON public.trip_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trip history" 
ON public.trip_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to log trip changes
CREATE OR REPLACE FUNCTION public.log_trip_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.trip_history (trip_id, user_id, destination_name, destination_country, destination_image, start_date, end_date, notes, budget, status, action)
    VALUES (NEW.id, NEW.user_id, NEW.destination_name, NEW.destination_country, NEW.destination_image, NEW.start_date, NEW.end_date, NEW.notes, NEW.budget, NEW.status, 'created');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.trip_history (trip_id, user_id, destination_name, destination_country, destination_image, start_date, end_date, notes, budget, status, action)
    VALUES (NEW.id, NEW.user_id, NEW.destination_name, NEW.destination_country, NEW.destination_image, NEW.start_date, NEW.end_date, NEW.notes, NEW.budget, NEW.status, 'updated');
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.trip_history (trip_id, user_id, destination_name, destination_country, destination_image, start_date, end_date, notes, budget, status, action)
    VALUES (OLD.id, OLD.user_id, OLD.destination_name, OLD.destination_country, OLD.destination_image, OLD.start_date, OLD.end_date, OLD.notes, OLD.budget, OLD.status, 'deleted');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for automatic history logging
CREATE TRIGGER log_saved_trips_changes
AFTER INSERT OR UPDATE OR DELETE ON public.saved_trips
FOR EACH ROW
EXECUTE FUNCTION public.log_trip_change();