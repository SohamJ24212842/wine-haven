// Debug endpoint to check Supabase connection and schema
import { NextResponse } from 'next/server';
import { createAdminClient, createServerClient } from '@/lib/supabase';

export async function GET() {
  const debug: any = {
    supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    errors: [] as string[],
  };

  if (!debug.supabaseConfigured) {
    debug.errors.push('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  if (!debug.hasAnonKey) {
    debug.errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  }
  if (!debug.hasServiceRoleKey) {
    debug.errors.push('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  // Try to connect to Supabase
  if (debug.supabaseConfigured && debug.hasServiceRoleKey) {
    try {
      const supabase = createAdminClient();
      if (supabase) {
        // Try to query the products table
        const { data, error, count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (error) {
          debug.errors.push(`Database query error: ${error.message} (Code: ${error.code})`);
          debug.tableExists = false;
        } else {
          debug.tableExists = true;
          debug.productCount = count || 0;
        }
      } else {
        debug.errors.push('Failed to create Supabase admin client');
      }
    } catch (error: any) {
      debug.errors.push(`Connection error: ${error.message}`);
    }
  }

  return NextResponse.json(debug, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}



