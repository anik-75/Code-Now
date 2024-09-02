import { createClient } from '@supabase/supabase-js';
import { supabaseKey, supabaseUrl } from '../config.js';

const supabase = createClient(supabaseUrl!, supabaseKey!);
export default supabase;
