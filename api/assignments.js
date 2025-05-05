import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mzzexuaurihweckvihse.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Hantera preflight-requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Hämta data från tabellen "assignments" där "is_active" är true
  const { data, error } = await supabase
    .from('assignments')
    .select(`
      id,
      assignment_number,
      assignment_text,
      image_url,
      answer,
      use_calc,
      assignment_level
    `)
    .eq('is_active', true) // Endast aktiva uppgifter
    .order('assignment_number', { ascending: true }) // Sortera efter nummer

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // Returnera data (eller en tom lista)
  return res.status(200).json(data || [])
}
