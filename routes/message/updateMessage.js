import { updateMessage } from "../../middleware/message";
import { messageSchema } from "../../schemas/message";

exports.plugin = {
  name: "updateMessage",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/messages/{message_id}",
      options: {
        validate: {
          payload: messageSchema
        }
      },
      handler: async (request, h) => {
        const message_id = request.params.message_id;
        const updatedMessage = await updateMessage(message_id, request.payload);

        return h
          .response(updatedMessage)
          .type("application/json")
          .code(200);
      }
    });
  }
};
