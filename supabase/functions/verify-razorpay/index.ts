import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import crypto from "https://deno.land/std@0.192.0/node/crypto.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id,
            plan,
            amount,
        } = body;

        const secret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

        // Verify Razorpay Signature
        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return new Response(
                JSON.stringify({ error: "Invalid payment signature" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Initialize Supabase Admin Client
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Insert Payment Record
        await supabase.from("payments").insert({
            user_id,
            razorpay_payment_id,
            amount,
            status: "captured",
        });

        // Create Subscription
        await supabase.from("subscriptions").insert({
            user_id,
            plan,
            amount,
            status: "active",
            current_period_start: new Date(),
            current_period_end: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
            ),
        });

        // Generate Invoice
        const gstRate = 18;
        const gstAmount = (amount * gstRate) / 100;
        const totalAmount = amount + gstAmount;

        await supabase.from("invoices").insert({
            invoice_number: `INV-${Date.now()}`,
            user_id,
            plan,
            amount,
            gst_rate: gstRate,
            gst_amount: gstAmount,
            total_amount: totalAmount,
            payment_id: razorpay_payment_id,
        });

        // Affiliate Commission Logic
        const { data: profile } = await supabase
            .from("profiles")
            .select("referred_by")
            .eq("id", user_id)
            .single();

        if (profile?.referred_by) {
            const refCode = profile.referred_by;

            const { data: affiliate } = await supabase
                .from("affiliates")
                .select("user_id")
                .eq("referral_code", refCode)
                .single();

            if (affiliate) {
                const commissionAmount = amount * 0.1; // 10% commission

                await supabase.from("commissions").insert({
                    referrer_id: affiliate.user_id,
                    referred_user_id: user_id,
                    amount: commissionAmount,
                    plan,
                    status: "approved",
                });

                await supabase.rpc("increment_affiliate_earnings", {
                    affiliate_user_id: affiliate.user_id,
                    commission_amount: commissionAmount,
                });
            }
        }

        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});