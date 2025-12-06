// API route for creating orders (Click & Collect)
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { Resend } from 'resend';

const STORE_EMAIL = 'mahajanwinehaven24@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// Initialize Resend lazily to avoid build-time errors
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

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
          const resend = getResend();
          if (resend) {
            try {
              // Format order email for store
              const emailSubject = `New Click & Collect Order #${order.id.substring(0, 8)}`;
              
              const storeEmailBodyHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #8B0000; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .section { margin-bottom: 20px; }
    .item { display: flex; gap: 15px; margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
    .item-image { width: 80px; height: 100px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
    .item-details { flex: 1; }
    .item-name { font-weight: bold; margin-bottom: 5px; }
    .total { font-size: 18px; font-weight: bold; color: #8B0000; margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; }
  </style>
</head>
<body>
  <div class="header">
    <h1>New Click & Collect Order Received</h1>
  </div>
  <div class="content">
    <div class="section">
      <h2>Order Information</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}</p>
    </div>
    
    <div class="section">
      <h2>Customer Details</h2>
      <p><strong>Name:</strong> ${customer_name}</p>
      <p><strong>Email:</strong> ${customer_email}</p>
      <p><strong>Phone:</strong> ${customer_phone}</p>
    </div>
    
    <div class="section">
      <h2>Collection Details</h2>
      <p><strong>Date:</strong> ${collection_date}</p>
      <p><strong>Time:</strong> ${collection_time}</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
    </div>
    
    <div class="section">
      <h2>Order Items</h2>
      ${items.map((item: any, index: number) => `
        <div class="item">
          <img src="${item.product_image || 'https://via.placeholder.com/80x100'}" alt="${item.product_name}" class="item-image" />
          <div class="item-details">
            <div class="item-name">${index + 1}. ${item.product_name}</div>
            <div>Quantity: ${item.quantity}</div>
            <div>Price: €${item.product_price.toFixed(2)} each</div>
            <div><strong>Subtotal: €${item.subtotal.toFixed(2)}</strong></div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="total">
      <p>Total: €${total.toFixed(2)}</p>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
    <p style="color: #666; font-size: 12px;">
      This is an automated notification from Wine Haven website.<br>
      Please contact the customer to confirm their collection time.
    </p>
  </div>
</body>
</html>
              `.trim();
              
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

              // Send email to store (HTML with images)
              await resend.emails.send({
                from: FROM_EMAIL,
                to: STORE_EMAIL,
                subject: emailSubject,
                html: storeEmailBodyHTML,
                text: storeEmailBody, // Fallback for email clients that don't support HTML
              });
              console.log('Store notification email sent successfully to', STORE_EMAIL);

              // Format customer confirmation email
              const customerEmailSubject = `Your Click & Collect Order #${order.id.substring(0, 8)} - Wine Haven`;
              
              const customerEmailBodyHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #8B0000; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .section { margin-bottom: 20px; }
    .item { display: flex; gap: 15px; margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
    .item-image { width: 80px; height: 100px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
    .item-details { flex: 1; }
    .item-name { font-weight: bold; margin-bottom: 5px; }
    .total { font-size: 18px; font-weight: bold; color: #8B0000; margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Thank You for Your Order!</h1>
  </div>
  <div class="content">
    <p>Dear ${customer_name},</p>
    <p>We've received your Click & Collect order and will have it ready for you.</p>
    
    <div class="section">
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' })}</p>
    </div>
    
    <div class="section">
      <h2>Collection Details</h2>
      <p><strong>Date:</strong> ${collection_date}</p>
      <p><strong>Time:</strong> ${collection_time}</p>
      <p><strong>Location:</strong> 47, George's Street Upper, Dún Laoghaire, Dublin, A96 K2H2</p>
    </div>
    
    <div class="section">
      <h2>Your Order</h2>
      ${items.map((item: any, index: number) => `
        <div class="item">
          <img src="${item.product_image || 'https://via.placeholder.com/80x100'}" alt="${item.product_name}" class="item-image" />
          <div class="item-details">
            <div class="item-name">${index + 1}. ${item.product_name}</div>
            <div>Quantity: ${item.quantity}</div>
            <div>Price: €${item.product_price.toFixed(2)} each</div>
            <div><strong>Subtotal: €${item.subtotal.toFixed(2)}</strong></div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="total">
      <p>Total: €${total.toFixed(2)}</p>
    </div>
    
    ${notes ? `<div class="section"><p><strong>Your Notes:</strong> ${notes}</p></div>` : ''}
    
    <p>We'll contact you at ${customer_phone} to confirm your collection time. If you have any questions, please don't hesitate to reach out to us.</p>
    <p>Looking forward to seeing you soon!</p>
    
    <div class="footer">
      <p><strong>Best regards,</strong><br>The Wine Haven Team</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
      <p><strong>Wine Haven</strong><br>
      47, George's Street Upper, Dún Laoghaire, Dublin, A96 K2H2<br>
      Phone: +353 89 4581875 | (01) 564 4028<br>
      Email: mahajanwinehaven24@gmail.com</p>
    </div>
  </div>
</body>
</html>
              `.trim();
              
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

              // Send confirmation email to customer (HTML with images)
              await resend.emails.send({
                from: FROM_EMAIL,
                to: customer_email,
                subject: customerEmailSubject,
                html: customerEmailBodyHTML,
                text: customerEmailBody, // Fallback for email clients that don't support HTML
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

