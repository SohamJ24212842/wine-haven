// API route for creating orders (Click & Collect)
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { Resend } from 'resend';

const STORE_EMAIL = 'mahajanwinehaven24@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const resend = new Resend(process.env.RESEND_API_KEY);

const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      collection_date,
      collection_time,
      notes,
      items,
      subtotal,
      total,
    } = body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !collection_date || !collection_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (USE_SUPABASE) {
      const supabase = createAdminClient();
      if (supabase) {
        try {
          // Create order
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              customer_email,
              customer_name,
              customer_phone,
              shipping_address: {
                type: 'collection',
                collection_date,
                collection_time,
                address: "47, George's Street Upper, Dún Laoghaire, Dublin, A96 K2H2",
              },
              status: 'pending',
              subtotal,
              shipping_cost: 0,
              tax: 0,
              total,
              payment_method: 'click_and_collect',
              payment_status: 'pending',
              notes: notes || null,
            })
            .select()
            .single();

          if (orderError) {
            console.error('Error creating order:', orderError);
            throw new Error(`Failed to create order: ${orderError.message}`);
          }

          // Create order items
          const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_slug: item.product_slug,
            product_name: item.product_name,
            product_price: item.product_price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) {
            console.error('Error creating order items:', itemsError);
            // Try to delete the order if items failed
            await supabase.from('orders').delete().eq('id', order.id);
            throw new Error(`Failed to create order items: ${itemsError.message}`);
          }

          // Send email notification directly (non-blocking)
          // We send emails directly here instead of making HTTP requests for better reliability
          if (process.env.RESEND_API_KEY) {
            try {
              // Format order email for store
              const emailSubject = `New Click & Collect Order #${order.id.substring(0, 8)}`;
              
              const storeEmailBody = `
New Click & Collect Order Received

Order ID: ${order.id}
Date: ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}

Customer Details:
- Name: ${customer_name}
- Email: ${customer_email}
- Phone: ${customer_phone}

Collection Details:
- Date: ${collection_date}
- Time: ${collection_time}
${notes ? `- Notes: ${notes}` : ''}

Order Items:
${items.map((item: any, index: number) => 
  `${index + 1}. ${item.product_name} (${item.quantity}x) - €${item.product_price.toFixed(2)} each = €${item.subtotal.toFixed(2)}`
).join('\n')}

Total: €${total.toFixed(2)}

---
This is an automated notification from Wine Haven website.
Please contact the customer to confirm their collection time.
              `.trim();

              // Send email to store
              await resend.emails.send({
                from: FROM_EMAIL,
                to: STORE_EMAIL,
                subject: emailSubject,
                text: storeEmailBody,
              });
              console.log('Store notification email sent successfully to', STORE_EMAIL);

              // Format customer confirmation email
              const customerEmailSubject = `Your Click & Collect Order #${order.id.substring(0, 8)} - Wine Haven`;
              
              const customerEmailBody = `
Dear ${customer_name},

Thank you for your order! We've received your Click & Collect order and will have it ready for you.

Order Details:
Order ID: ${order.id}
Date: ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}

Collection Details:
- Date: ${collection_date}
- Time: ${collection_time}
- Location: 47, George's Street Upper, Dún Laoghaire, Dublin, A96 K2H2

Your Order:
${items.map((item: any, index: number) => 
  `${index + 1}. ${item.product_name} (${item.quantity}x) - €${item.product_price.toFixed(2)} each = €${item.subtotal.toFixed(2)}`
).join('\n')}

Total: €${total.toFixed(2)}

${notes ? `\nYour Notes: ${notes}\n` : ''}

We'll contact you at ${customer_phone} to confirm your collection time. If you have any questions, please don't hesitate to reach out to us.

Looking forward to seeing you soon!

Best regards,
The Wine Haven Team

---
Wine Haven
47, George's Street Upper, Dún Laoghaire, Dublin, A96 K2H2
Phone: +353 89 4581875 | (01) 564 4028
Email: mahajanwinehaven24@gmail.com
              `.trim();

              // Send confirmation email to customer
              await resend.emails.send({
                from: FROM_EMAIL,
                to: customer_email,
                subject: customerEmailSubject,
                text: customerEmailBody,
              });
              console.log('Customer confirmation email sent successfully to', customer_email);
            } catch (emailError: any) {
              console.error('Error sending emails:', {
                message: emailError.message,
                name: emailError.name,
                response: emailError.response?.body || emailError.response
              });
              // Continue even if email fails - don't fail the order
            }
          } else {
            console.warn('RESEND_API_KEY not configured. Emails will not be sent.');
          }

          return NextResponse.json({
            success: true,
            orderId: order.id,
            message: 'Order submitted successfully',
          });
        } catch (error: any) {
          console.error('Error in order creation:', error);
          return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 500 }
          );
        }
      }
    }

    // Fallback if Supabase not configured
    return NextResponse.json(
      { error: 'Database not configured. Please set up Supabase.' },
      { status: 503 }
    );
  } catch (error: any) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process order' },
      { status: 500 }
    );
  }
}

