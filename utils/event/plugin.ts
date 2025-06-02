import { Elysia } from "elysia";
import { EventEmitter } from "events";

export const eventEmitter = new EventEmitter();

export const EventEmitterPlugin = new Elysia({
	name: "event-emitter",
}).decorate("eventEmitter", eventEmitter);
