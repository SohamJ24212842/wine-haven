// API route for creating orders (Click & Collect)
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

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
                address: "George's Street Upper, Dún Laoghaire, Dublin, A96 K2H2",
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

          // Send email notification (non-blocking)
          try {
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/orders/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.id,
                orderData: {
                  customer_name,
                  customer_email,
                  customer_phone,
                  collection_date,
                  collection_time,
                  notes,
                  items,
                  total,
                },
              }),
            }).catch((err) => {
              console.error('Failed to send email notification:', err);
              // Don't fail the order if email fails
            });
          } catch (emailError) {
            console.error('Email notification error:', emailError);
            // Continue even if email fails
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

