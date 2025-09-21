import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ccupofirsufkeezsoyzm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdXBvZmlyc3Vma2VlenNveXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MTQ1NjUsImV4cCI6MjA3Mzk5MDU2NX0.BTt8QrLIBrDE8nDkUx-qFAqTn8ZktSs7JyAx-3Dv0y0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)