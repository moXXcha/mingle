import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

export async function POST(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // sign out
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.redirect(`${requestUrl.origin}`, {
      status: 301,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
