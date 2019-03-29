import { getMessage } from "../../middleware/message";

exports.plugin = {
  name: "message",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/api/messages/{message_id}",
      handler: async (request, h) => {
        const message_id = request.params.message_id;
        const message = await getMessage(message_id);

        return h
          .response(message)
          .type("application/json")
          .code(200);
      }
    });
  }
};
