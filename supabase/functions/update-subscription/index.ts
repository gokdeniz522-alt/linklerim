// Supabase Function - Ödeme tamamlandığında kullanıcı abonelik planını güncelleme
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Sadece POST isteklerini kabul et
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // JSON verisini al
    const payload = await req.json();
    
    // Ecwid webhook doğrulaması (isteğe bağlı)
    const webhookSignature = req.headers.get('X-Ecwid-Webhook-Signature');
    // Burada imzayı doğrulama işlemi yapılabilir
    
    // Kullanıcı ID'sini ve yeni planı al
    const userId = payload.userId;
    const newPlan = payload.newPlan || 'pro';
    
    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }
    
    // Kullanıcının abonelik planını güncelle
    const { error } = await supabase
      .rpc('update_user_subscription', {
        user_id: userId,
        new_plan: newPlan
      });
    
    if (error) {
      console.error('Error updating subscription:', error);
      return new Response('Error updating subscription', { status: 500 });
    }
    
    return new Response('Subscription updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
});