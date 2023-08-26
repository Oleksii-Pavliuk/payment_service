import { stripe } from "./stripe";
import { Channel } from "amqplib";

import {createNewTransactionEntry} from "./add-transaction-toDB"

export async function handleNewStripeDeposit(messageContent: string, channel : Channel) {
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


	msg.destination = "deposits"

	createNewTransactionEntry(JSON.stringify(msg), channel);

	return msg;


}
