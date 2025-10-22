import { createClient } from '@supabase/supabase-js'

// Configure Supabase from Expo public env vars.
// These are safe to expose in client apps and should be set in your .env file or EAS secrets.
// See .env.example and README.md for details.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error(
		'[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
			'Create a .env from .env.example and set your project URL and anon key.'
	)
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
