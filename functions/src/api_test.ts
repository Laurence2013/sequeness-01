import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import axios from "axios";

export const apiTest = onRequest(async (request, response) => {
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
