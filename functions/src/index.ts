import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";

setGlobalOptions({maxInstances: 10});

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
