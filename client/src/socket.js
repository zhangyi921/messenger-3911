import io from "socket.io-client";
import store from "./store";
import axios from "axios";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  markMsgAsRead
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("message-read", (data) => {
    store.dispatch(markMsgAsRead(data))
  });
  socket.on("new-message", async (data) => {
    const activeConversation = store.getState().activeConversation
    const conversations = store.getState().conversations
    if (data.sender === null){
      // new message in existing conversation
      // if the new message belong to the active chat, let other use know the msg is read
      for (const convo of conversations){
        if (convo.otherUser.id === data.message.senderId && convo.otherUser.username === activeConversation){
          socket.emit("message-read", {
            messageId: data.message.id,
            conversationId: data.message.conversationId,
            senderId: data.message.senderId,
          });
          await axios.post("/api/messages/read", {
            messageId: data.message.id,
            conversationId: data.message.conversationId,
            senderId: data.message.senderId,
          });
        }
      }
    }
    store.dispatch(setNewMessage(data.message, data.sender, activeConversation));
  });
});

export default socket;
