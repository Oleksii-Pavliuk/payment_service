import { stripe } from "./stripe";
import { Channel } from "amqplib";
export async function createNewTransactionEntry(messageContent: string, channel : Channel) {
	console.log("Received new transaction:", messageContent);


	let queue = await channel.assertQueue("transactions");
    
    channel.sendToQueue(queue.queue,Buffer.from(messageContent), { type: "transaction" });
    console.log('AMQP message sent to transactions');
    console.log(messageContent);
}
