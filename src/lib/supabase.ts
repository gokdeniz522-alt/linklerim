import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uqvchtpkmztubmpfowmp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdmNodHBrbXp0dWJtcGZvd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDk1OTYsImV4cCI6MjA3Mzg4NTU5Nn0.L662VvPtz3aV3OTKGM381VohvFqpL9DbFavQcv8w1Ks'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)