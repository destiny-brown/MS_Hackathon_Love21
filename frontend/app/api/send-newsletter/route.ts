import { NextRequest, NextResponse } from 'next/server';

// Helper to get subscribers
function getSubscribers(): any[] {
  // In production, this would be a database query
  // For hackathon demo, return mock data
  return [
    { id: '1', email: 'demo1@example.com', firstName: 'John' },
    { id: '2', email: 'demo2@example.com', firstName: 'Jane' },
    { id: '3', email: 'demo3@example.com', firstName: 'Mike' },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const { subject, content } = await request.json();

    // Get subscribers
    const subscribers = getSubscribers();

    // Simulate sending to subscribers
    console.log(`📧 Sending newsletter: "${subject}"`);
    console.log(`📝 Content: ${content.substring(0, 100)}...`);
    console.log(`👥 Sending to ${subscribers.length} subscribers`);

    // Log each subscriber (for demo)
    subscribers.forEach((sub, index) => {
      console.log(`  ${index + 1}. ${sub.email} (${sub.firstName})`);
    });

    // In production, you'd use:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`,
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}