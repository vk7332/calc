import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
    const { amount, description, customer } = await req.json();

    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    const auth = btoa(`${keyId}:${keySecret}`);

    const response = await fetch("https://api.razorpay.com/v1/payment_links", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: amount * 100,
            currency: "INR",
            description: description,
            customer: customer,
            notify: {
                sms: true,
                email: true
            },
            reminder_enable: true
        })
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
    });
});