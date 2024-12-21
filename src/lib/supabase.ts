import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nbyzigrsbbbmzwswqxcz.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieXppZ3JzYmJibXp3c3dxeGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2ODYxOTcsImV4cCI6MjA0OTI2MjE5N30.CD2eF6TujW_I4XA8IhW_QaGWibgGTYxHba-XTY3cv60"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)