import { stripe } from "./stripe";

export async function handleNewStripeDeposit(messageContent: string) {
	console.log("Received new_message: ", messageContent);

	// createCustomer();
	const msg = JSON.parse(messageContent);

	// Create a PaymentIntent with the order amount and currency
	// const paymentIntent = await stripe.paymentIntents.create({
	// 	amount: msg.item.amount,
	// 	currency: msg.item.currency,
	// 	automatic_payment_methods: {
	// 		enabled: true,
	// 	},
	// });
	// return paymentIntent.client_secret;
	return msg;
}
