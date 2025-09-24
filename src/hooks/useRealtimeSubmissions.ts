import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function useRealtimeSubmissions(userEmail: string | null) {
  const [submissionStatus, setSubmissionStatus] = useState<string>('pending')
  const [hasSubmission, setHasSubmission] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!userEmail) return

    // Initial fetch
    const fetchSubmissionStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('status')
          .eq('user_email', userEmail)
          .order('created_at', { ascending: false })
          .limit(1)
        
        if (!error && data && data.length > 0) {
          setSubmissionStatus(data[0].status)
          setHasSubmission(true)
        }
      } catch (error) {
        console.error('Error fetching submission status:', error)
      }
    }

    fetchSubmissionStatus()

    // Set up realtime subscription
    const channel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'submissions',
          filter: `user_email=eq.${userEmail}`
        },
        (payload) => {
          const newStatus = payload.new.status
          setSubmissionStatus(newStatus)
          setHasSubmission(true)

          // Show notification based on status
          const statusMessages = {
            shipped: 'Your sample has been shipped to the lab!',
            delivered: 'Your sample has been received by the lab.',
            analyzed: 'Great news! Your analysis is complete. Results are now available.',
          }

          if (statusMessages[newStatus as keyof typeof statusMessages]) {
            toast({
              title: 'Sample Status Update',
              description: statusMessages[newStatus as keyof typeof statusMessages],
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userEmail, toast])

  return { submissionStatus, hasSubmission }
}