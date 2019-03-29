import { deleteMessage } from "../../middleware/message";

exports.plugin = {
  name: "deleteMessage",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "DELETE",
      path: "/api/messages/{message_id}",
      handler: async (request, h) => {
        const { message_id } = request.params;
        const deletedId = await deleteMessage(message_id);

        return h
          .response({ message_id: deletedId })
          .type("application/json")
          .code(200);
      }
    });
  }
};
