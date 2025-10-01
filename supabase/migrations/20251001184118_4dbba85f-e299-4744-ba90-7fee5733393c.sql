-- Drop existing constraint if it exists
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_status_check;

-- Add check constraint to limit status values (creates dropdown in Lovable Cloud)
ALTER TABLE public.submissions 
ADD CONSTRAINT submissions_status_check 
CHECK (status IN ('pending', 'collected', 'shipped', 'delivered', 'analyzed', 'done'));

-- Update any existing 'analyzed' statuses to 'done' for consistency
UPDATE public.submissions SET status = 'done' WHERE status = 'analyzed';