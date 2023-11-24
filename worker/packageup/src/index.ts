/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { sendMail } from "./email";
import { analyze } from "../../../src/analyze";
import { report } from "../../../src/report";
import { ProjectInfo } from "../../../src/inspect";

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
	temp: ''
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.url.includes('email')) {
			const res = await sendMail('damiantarnawsky@gmail.com', '[packageup] Report for ${project}', 'Hi there.');
			return new Response('Email:' + res);
		}
		if (request.url.endsWith('/package')) {
			const project: ProjectInfo = JSON.parse(await request.json());
			console.log('Analyzing...');
			try {
				const projectResults = await analyze(project);
				if (projectResults) {
					console.log('Reporting...');
					const html = await report(projectResults, { type: 'html' });
					console.log('Sending...');
					const res = await sendMail('damiantarnawsky@gmail.com', '[packageup] Report for ${project}', html);
					return new Response(res ? res : '');
				}
				} catch (err) {
				console.error(`Failed to analyze: `+err);
				return new Response('Failure');

			}
		}
		if (!ctx) {
			console.log('temp');
		}
		return new Response('Hello World!' + env.temp);
	},
};
