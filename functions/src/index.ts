import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import axios from "axios";

import Stripe from "stripe";

let stripe: Stripe;

setGlobalOptions({maxInstances: 10});

export const stripe01 = onRequest(async (req, res) => {
	if (!stripe) {
		const stripe00 = process.env.STRIPE_SECRET_KEY;
		if (!stripe00) {
			console.log("Stripe secret key is not set!");
			res.status(500).send("Configuration error.");
			return;
		}
		stripe = new Stripe(stripe00, {apiVersion: "2025-07-30.basil"});
	}
	const plan = req.query.plan;
	if (!plan) {
		res.send("Subscription plan not found");
		return;
	}
	let priceId;

	switch (plan) {
		case "quotes-in-a-jar-x3": {
			const priceId00: string = process.env.QUOTES_IN_A_JAR_X3 as string;
			priceId = priceId00;
			break;
		}
		case "quotes-in-a-jar-x6": {
			const priceId00: string = process.env.QUOTES_IN_A_JAR_X6 as string;
			priceId = priceId00;
			break;
		}
		case "quotes-in-a-jar-x12": {
			const priceId00: string = process.env.QUOTES_IN_A_JAR_X12 as string;
			priceId = priceId00;
			break;
		}
		default: {
			res.send("Subscription plan not found");
			return;
		}
	}
	try {
		const session = await stripe.checkout.sessions.create({
			mode: "subscription", 
			line_items: [
				{price: priceId, quantity: 1},
			],
			success_url: "http://localhost:5001/success?session_id={CHECKOUT_SESSION_ID}",
			cancel_url: "http://localhost:5001/cancel",
		});
		res.send(session);
		// res.redirect(303, session.url as string);
		return;
	} catch (err) {
		console.log(err);
	}
});

export const helloWorld = onRequest((request, response) => {
	logger.info("Hello logs!", {structuredData: true});
	response.send("Hello from Firebase!");
});
export const api = onRequest(async (request, response) => {
	logger.info("myHttpRequestFunction received a request!");

	switch (request.method) {
		case "GET": {
			const response00 = await axios.get("https://jsonplaceholder.typicode.com/users/1");
			response.send(response00.data);
			break;
		}
		case "POST": {
			const body = request.body;
			response.send(body);
			break;
		}
		case "DELETE": {
			response.send("It was DELETE request");
			break;
		}
		default: {
			response.send("It was a default request...");
		}
	}
});
