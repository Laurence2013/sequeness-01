import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import axios from "axios";

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
	throw new Error("Stripe secret key is not set in environment variables");
}

const stripe00 = new Stripe(stripeSecretKey, {apiVersion: "2025-07-30.basil"});

setGlobalOptions({maxInstances: 10});

export const stripe01 = onRequest(async (req, res) => {
	const plan = req.query.plan;
	console.log(plan);

	if (!plan) {
		res.send("Subscription plan not found");
		return;
	}

	let priceId;

	switch (plan) {
		case "Quotes in a jar x3": {
			priceId = "prod_SoUSRWjqzZNL4T";
			break;
		}
		case "Quotes in a jar x6": {
			priceId: "prod_SoUUKK4MyUyKeg";
			break;
		}
		case "Quotes in a jar x12": {
			priceId: "prod_SoUV5XkLbsdO3J";
			break;
		}
		default: {
			res.send("Subscription plan not found");
			return;
		}
	}

	const session = await stripe00.checkout.sessions.create({
		mode: "subscription", 
		line_items: [
			{price: priceId, quantity: 1},
		],
		success_url: "http://localhost:5001/success?session_id={CHECKOUT_SESSION_ID}",
		cancel_url: "http://localhost:5001/cancel",
	});
	console.log(session);
	res.redirect(303, session.url as string);
	return;
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
