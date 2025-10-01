import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "https://esm.sh/resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

interface EmailRequest {
  doctorName: string
  doctorEmail: string
  userEmail: string
  pdfBase64: string
  notes?: string
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

    const { doctorName, doctorEmail, userEmail, pdfBase64, notes }: EmailRequest = await req.json()

    if (!doctorName || !doctorEmail || !userEmail || !pdfBase64) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Convert base64 to buffer for PDF attachment
    const pdfBuffer = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0))

    const { data, error } = await resend.emails.send({
      from: 'anan.lakk21@gmail.com',
      reply_to: 'anan.lakk21@gmail.com',
      to: [doctorEmail],
      subject: `MindWell Health Report for Patient: ${userEmail}`,
      html: `
        <h2>Dear Dr. ${doctorName},</h2>
        
        <p>You have received a comprehensive health report from your patient: <strong>${userEmail}</strong></p>
        
        <p>This report includes:</p>
        <ul>
          <li>Complete metabolomic analysis results</li>
          <li>Depression screening findings</li>
          <li>Activity and mood tracking data</li>
          <li>Personalized health recommendations</li>
          <li>Medical history and current medications</li>
        </ul>
        
        ${notes ? `<p><strong>Additional Notes from Patient:</strong><br/>${notes.replace(/\n/g, '<br/>')}</p>` : ''}
        
        <p>Please find the detailed report attached as a PDF document.</p>
        
        <p>This report has been securely transmitted and is HIPAA-compliant.</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
        
        <p style="font-size: 12px; color: #666;">
          <strong>MindWell Depression Detection Platform</strong><br/>
          This report is generated from validated metabolomic analysis and activity tracking data.<br/>
          For questions about this report, please contact: support@mindwell.app
        </p>
      `,
      attachments: [
        {
          filename: `MindWell_Report_${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBase64,
        }
      ]
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ success: true, emailId: data?.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in send-report-email function:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})