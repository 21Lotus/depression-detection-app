import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { tracking_id } = await req.json()

    if (!tracking_id) {
      return new Response(
        JSON.stringify({ error: 'Tracking ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update submission status
    const { data, error } = await supabase
      .from('submissions')
      .update({ 
        status: 'analyzed',
        analyzed_at: new Date().toISOString()
      })
      .eq('tracking_id', tracking_id)
      .select('user_email')
      .single()

    if (error) {
      throw error
    }

    // TODO: Implement push notification logic here
    // This would typically involve:
    // 1. Looking up the user's FCM token based on email
    // 2. Sending push notification via Firebase Cloud Messaging
    // 3. Fallback to email notification if no FCM token

    console.log(`Sample ${tracking_id} marked as analyzed for user ${data.user_email}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Sample ${tracking_id} marked as analyzed`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})