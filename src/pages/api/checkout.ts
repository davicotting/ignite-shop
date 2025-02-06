import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handleHello(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const priceId = request.body.priceId;

  if (request.method != "POST") {
    return response.status(406).json({ error: "Method Not Allowed." });
  }

  if (!priceId) {
    return response.status(400).json({ error: "Price not found." });
  }

  const success_url = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancel_url = `${process.env.NEXT_URL}/`;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    cancel_url: cancel_url,
    success_url: success_url,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  return response.status(201).json({ checkoutURL: checkoutSession.url });
}
