import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
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

	if (!plan) return res.send("Subscription plan not found");

	let priceId;

	switch (plan.toLowerCase()) {
		case "Quotes in a jar x3":
			priceId = "prod_SoUSRWjqzZNL4T";
			break
	}

	const session = await stripe00.checkout.sessions.create({
		mode: "subscription", 
		line_items: []
	});
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
