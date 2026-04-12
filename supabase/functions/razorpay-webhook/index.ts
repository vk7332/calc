import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import crypto from "https://deno.land/std@0.168.0/node/crypto.ts";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
    try {
        const signature = req.headers.get("x-razorpay-signature")!;
        const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;
        const bodyText = await req.text();

        // Verify Razorpay Signature
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(bodyText)
            .digest("hex");

        if (expectedSignature !== signature) {
            return new Response("Invalid signature", {