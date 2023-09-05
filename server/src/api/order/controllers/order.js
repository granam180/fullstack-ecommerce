"use strict";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2023-08-16",
//   maxNetworkRetries: 1,
//   timeout: 1000,
//   host: "localhost",
//   port: 1337,
//   telemetry: true,
// });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // eslint-disable-next-line
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    //  we have acces to the strapi API and able to modify custom functionality

    const { products, userName, email } = ctx.request.body;
    try {
      // retrieve item information and cycle through products to findOne(product.id)
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const item = await strapi
            .service("api::item.item")
            .findOne(product.id);

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100,
            },
            quantity: product.count,
          };
        })
      );

      // CREATE a stripe session
      // https://stripe.com/docs/api/checkout/sessions/create?lang=node
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        mode: "payment",
        success_url: "http://localhost:3000/checkout/success",
        cancel_url: "http://localhost:3000",
        line_items: lineItems,
      });

      // CREATE the item
      await strapi
        .service("api::order.order")
        .create({ data: { userName, products, stripeSessionId: session.id } });

      // RETURN the session id
      return { id: session.id };
    } catch (error) {
      ctx.response.status = 500;
      return { error: { message: "There was a problem creating the charge" } };
    }
  },
}));
