import { chatMessageSchema } from "../../schemas/chat";
import { failAction } from "../../utils/validation";
import { pre_getChatId, addMessageToChat } from "../../middleware/chat";

exports.plugin = {
  name: "chat",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/api/users/chat/{chat_id}",
      config: {
        validate: {
          payload: chatMessageSchema,
          failAction
        },
        // add auth later
        auth: false,
        // if no chat exists, create new chat
        pre: [{ method: pre_getChatId, assign: "chat_id" }],
        // provide exclusive WebSocket route
        plugins: { websocket: { only: true, autoping: 30 * 1000 } }
      },
      handler: async (request, h) => {
        const { chat_id } = request.pre;
        // save in Db
        const message = await addMessageToChat(chat_id, request.payload);

        // does nothing
        server.events.emit("chat", { chat_id, message });

        const { peers } = request.websocket();
        // either find correct peer or figure out pub/ sub
        peers.forEach(peer => {
          console.log("TCL: peer", peer);
          peer.send(JSON.stringify(message));
        });

        // return to writer
        return { hallo: peers[0] };
      }
    });
  }
};
