// API route to send order notification emails
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const STORE_EMAIL = 'mahajanwinehaven24@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData, orderId } = body;

    // Format order email for store
    const emailSubject = `New Click & Collect Order #${orderId.substring(0, 8)}`;
    
    const storeEmailBody = `
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

    // Format customer confirmation email
    const customerEmailSubject = `Your Click & Collect Order #${orderId.substring(0, 8)} - Wine Haven`;
    
    const customerEmailBody = `
Dear ${orderData.customer_name},

Thank you for your order! We've received your Click & Collect order and will have it ready for you.

Order Details:
Order ID: ${orderId}
Date: ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}

Collection Details:
- Date: ${orderData.collection_date}
- Time: ${orderData.collection_time}
- Location: 47, George's Street Upper, Dún Laoghaire, Dublin, A96 K2H2

Your Order:
${orderData.items.map((item: any, index: number) => 
  `${index + 1}. ${item.product_name} (${item.quantity}x) - €${item.product_price.toFixed(2)} each = €${item.subtotal.toFixed(2)}`
).join('\n')}

Total: €${orderData.total.toFixed(2)}

${orderData.notes ? `\nYour Notes: ${orderData.notes}\n` : ''}

We'll contact you at ${orderData.customer_phone} to confirm your collection time. If you have any questions, please don't hesitate to reach out to us.

Looking forward to seeing you soon!

Best regards,
The Wine Haven Team

---
Wine Haven
47, George's Street Upper, Dún Laoghaire, Dublin, A96 K2H2
Phone: +353 89 4581875 | (01) 564 4028
Email: mahajanwinehaven24@gmail.com
    `.trim();

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email will be logged only.');
      console.log('='.repeat(50));
      console.log('ORDER EMAIL NOTIFICATION (STORE)');
      console.log('='.repeat(50));
      console.log(`To: ${STORE_EMAIL}`);
      console.log(`Subject: ${emailSubject}`);
      console.log('\n' + storeEmailBody);
      console.log('='.repeat(50));
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email notification logged (RESEND_API_KEY not configured)' 
      });
    }

    // Send email to store
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: STORE_EMAIL,
        subject: emailSubject,
        text: storeEmailBody,
      });
      console.log('Store notification email sent successfully');
    } catch (storeEmailError: any) {
      console.error('Error sending store email:', storeEmailError);
      // Continue to try sending customer email even if store email fails
    }

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: orderData.customer_email,
        subject: customerEmailSubject,
        text: customerEmailBody,
      });
      console.log('Customer confirmation email sent successfully');
    } catch (customerEmailError: any) {
      console.error('Error sending customer email:', customerEmailError);
      // Don't fail the whole request if customer email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order emails sent successfully' 
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

