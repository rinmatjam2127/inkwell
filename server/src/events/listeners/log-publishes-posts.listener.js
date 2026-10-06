import { EventBus } from "../event-bus.js";

EventBus.on("post.published", (payload) => {
    EventBus.on("post.published", payload);
});
