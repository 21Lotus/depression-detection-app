import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StatusUpdateRequest {
  userEmail: string
  status: 'pending' | 'collected' | 'shipped' | 'delivered' | 'analyzed'
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

    const { userEmail, status }: StatusUpdateRequest = await req.json()

    if (!userEmail || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing userEmail or status' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update the submission status
    const { data, error } = await supabase
      .from('submissions')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'analyzed' ? { analyzed_at: new Date().toISOString() } : {})
      })
      .eq('user_email', userEmail)
      .select('tracking_id, status')
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log(`Sample status updated to ${status} for user ${userEmail}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        tracking_id: data.tracking_id,
        status: data.status 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in update-sample-status function:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})