import { NextRequest, NextResponse } from 'next/server';

const HERMES_ENDPOINT = process.env.HERMES_ENDPOINT || 'http://127.0.0.1:8642';
const HERMES_API_KEY = process.env.HERMES_API_KEY || 'e33c15fc7d9e861831bbeacda12e9e523a6a577ea6521cbf02cc86c7877e5c2f';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    console.log('Calling Hermes API...');

    const response = await fetch(`${HERMES_ENDPOINT}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HERMES_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'tencent/hy3:free',
        messages: [
          {
            role: 'system',
            content: `You are a professional newsletter writer for Love 21 Foundation.

            IMPORTANT RULES:
            1. Generate ONLY the newsletter content - NO introductory text, NO "Here is your newsletter", NO "Note:" messages, NO "I have all the real content" phrases.
            2. Start directly with the newsletter content (Subject: or Dear).
            3. End with the footer.
            4. Use proper paragraphs, NO markdown symbols like ** or ---.
            5. All content must be based on love21foundation.com website data.
            6. Make it polished, professional, and email-ready.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hermes API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `Hermes API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    console.log('Hermes API response received');

    return NextResponse.json({
      success: true,
      content: content,
    });
  } catch (error) {
    console.error('Newsletter generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate newsletter' },
      { status: 500 }
    );
  }
}