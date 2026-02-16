import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pzgwuwkpsrxeunlyhnoq.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Z3d1d2twc3J4ZXVubHlobm9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNjI1MDQsImV4cCI6MjA4NjczODUwNH0.9M46bJsH0N1-R42HEzoWbL6UBlyF5UJA_jFbW8cdfV0"

export const supabase = createClient(supabaseUrl, supabaseKey)