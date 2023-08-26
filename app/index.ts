import express, { response } from "express";
import amqp from "amqplib";

//Local modules
import config from "./config/config";
import { register as registerConsul } from "./consul/consul-connection";
import {handleNewStripeDeposit} from "./handlers/stripe-deposit"

/* =================
   SERVER SETUP
================== */

const AMQPHOST = config.get("amqphost");
const AMQPPORT = config.get("amqpport");
const PORT = config.get("port");
const app = express();

/* ======
   ROUTES
========*/
// Consul health checks route
app.get("/health", (_req, res) => {
	res.sendStatus(200);
});

/* ===========
   SUBSCRIBERS
=============*/
main("payments").catch((err) => console.log(err));

async function main(queueName: string) {
	/* ======================
       START RABBIT CONSUMER
    =========================*/
	const conn = await amqp.connect(`amqp://${AMQPHOST}:${AMQPPORT}`);
	const ch = await conn.createChannel();
	await ch.assertQueue(queueName);

	ch.prefetch(1);
	console.log('Awaiting payment requests');
	/* ======================
       START HANDLE MESSAGES
    =========================*/
	ch.consume(queueName, async (msg) => {
		await handleMessageConsume(ch, msg, {
			"stripe_deposit": handleNewStripeDeposit
		});
	});
}



export async function handleMessageConsume(
	channel: amqp.Channel,
	msg: amqp.ConsumeMessage | null,
	handlers: {
		stripe_deposit: typeof handleNewStripeDeposit;
	}
) {
	if (msg !== null) {
		const handler = handlers[msg.properties.type as "stripe_deposit"];
		if (handler) {
			const response = await handler(msg.content.toString(), channel);
			//Send the response with client secret back.
			if (response){
				channel.sendToQueue(msg.properties.replyTo,Buffer.from(response.toString()), {correlationId: msg.properties.correlationId});
			}
		} else {
			console.log(
				`Message with unhandled \`type\` received: ${msg.properties.type}. Ignoring...`
			);
		}
		channel.ack(msg);
	} else {
		console.log("Consumer cancelled by server");
	}
}


/* =================
   SERVER START
================== */
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
	registerConsul();
});
