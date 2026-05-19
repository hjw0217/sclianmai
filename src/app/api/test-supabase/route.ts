import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  try {
    // 测试直接连接 Supabase REST API
    const response = await fetch(`${url}/rest/v1/timeslots?select=id&limit=1`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: `${url.substring(0, 30)}...`,
      responsePreview: text.substring(0, 200),
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      url: `${url.substring(0, 30)}...`,
      hasAnonKey: !!anonKey,
      anonKeyPrefix: anonKey?.substring(0, 20) + '...',
    }, { status: 500 });
  }
}
