-- Ensure submissions.status only allows specific values including 'done'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'submissions_status_check'
      AND tc.table_schema = 'public'
      AND tc.table_name = 'submissions'
  ) THEN
    ALTER TABLE public.submissions
    ADD CONSTRAINT submissions_status_check
    CHECK (status IN ('pending','collected','shipped','delivered','analyzed','done'));
  END IF;
END$$;