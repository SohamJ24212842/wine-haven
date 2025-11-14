// API route to send order notification emails
import { NextRequest, NextResponse } from 'next/server';

const STORE_EMAIL = 'mahajanwinehaven24@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData, orderId } = body;

    // Format order email
    const emailSubject = `New Click & Collect Order #${orderId.substring(0, 8)}`;
    
    const emailBody = `
New Click & Collect Order Received

Order ID: ${orderId}
Date: ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}

Customer Details:
- Name: ${orderData.customer_name}
- Email: ${orderData.customer_email}
- Phone: ${orderData.customer_phone}

Collection Details:
- Date: ${orderData.collection_date}
- Time: ${orderData.collection_time}
${orderData.notes ? `- Notes: ${orderData.notes}` : ''}

Order Items:
${orderData.items.map((item: any, index: number) => 
  `${index + 1}. ${item.product_name} (${item.quantity}x) - €${item.product_price.toFixed(2)} each = €${item.subtotal.toFixed(2)}`
).join('\n')}

Total: €${orderData.total.toFixed(2)}

---
This is an automated notification from Wine Haven website.
Please contact the customer to confirm their collection time.
    `.trim();

    // For now, we'll use a simple approach: log to console and return success
    // In production, you can integrate with:
    // - Resend (recommended for Vercel)
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES
    
    console.log('='.repeat(50));
    console.log('ORDER EMAIL NOTIFICATION');
    console.log('='.repeat(50));
    console.log(`To: ${STORE_EMAIL}`);
    console.log(`Subject: ${emailSubject}`);
    console.log('\n' + emailBody);
    console.log('='.repeat(50));

    // TODO: Integrate with email service
    // Example with Resend (uncomment and configure):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'orders@winehaven.ie',
      to: STORE_EMAIL,
      subject: emailSubject,
      text: emailBody,
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Email notification logged (configure email service for production)' 
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

