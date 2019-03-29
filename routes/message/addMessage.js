import { addMessage } from "../../middleware/message";
import { messageSchema } from "../../schemas/message";

exports.plugin = {
  name: "addMessage",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/messages",
      options: {
        validate: {
          payload: messageSchema
        }
      },
      handler: async (request, h) => {
        const newMessage = await addMessage(request.payload);

        return h
          .response(newMessage)
          .type("application/json")
          .code(201);
      }
    });
  }
};
