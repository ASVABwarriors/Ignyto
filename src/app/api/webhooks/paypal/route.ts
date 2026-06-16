import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYPAL_API_URL = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

// Helper to get PayPal Access Token
async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// Helper to verify Webhook Signature
async function verifySignature(req: Request, bodyText: string) {
  const accessToken = await getPayPalAccessToken();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  const response = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: req.headers.get("paypal-auth-algo"),
      cert_url: req.headers.get("paypal-cert-url"),
      transmission_id: req.headers.get("paypal-transmission-id"),
      transmission_sig: req.headers.get("paypal-transmission-sig"),
      transmission_time: req.headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(bodyText),
    }),
  });

  const data = await response.json();
  return data.verification_status === "SUCCESS";
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    
    // Verify the webhook signature
    const isValid = await verifySignature(req, bodyText);
    if (!isValid) {
      console.error("PayPal Webhook Signature Verification Failed.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);
    const eventType = event.event_type;

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource;
      const enrollmentId = resource.custom_id;
      const paypalOrderId = resource.id;
      const amount = parseFloat(resource.amount?.value || "0");

      if (enrollmentId) {
        // Find if the enrollment exists
        const enrollment = await prisma.enrollment.findUnique({
          where: { id: enrollmentId },
        });

        if (enrollment) {
          if (enrollment.status === "PENDING") {
            // Record payment
            const payment = await prisma.payment.create({
              data: {
                courseId: enrollment.courseId,
                paypalOrderId: paypalOrderId,
                amount: amount,
                status: "COMPLETED",
              },
            });

            // Update enrollment
            await prisma.enrollment.update({
              where: { id: enrollmentId },
              data: {
                paymentId: payment.id,
                status: "CONFIRMED",
              },
            });

            console.log(`Webhook successfully processed for Enrollment: ${enrollmentId}`);
          } else {
            console.log(`Enrollment ${enrollmentId} is already confirmed.`);
          }
        } else {
          console.log(`Enrollment ${enrollmentId} not found.`);
        }
      }
    }

    // Always return a 200 OK so PayPal knows we received it
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("PayPal Webhook Error:", error);
    // Return 500 so PayPal might retry if there was a server error
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}