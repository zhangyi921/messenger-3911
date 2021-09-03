

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [{...message, isLastReadMessage: false}],
      unreadMsgCount: 1,
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      // increament unReadMsgCount if the msg is from other user
      if (message.senderId === convo.otherUser.id){
        // increament unReadMsgCount if this is inactive chat
        if (payload.activeConversation !== convo.otherUser.username){
          return {
            ...convo,
            messages: [...convo.messages, message],
            latestMessageText: message.text,
            unreadMsgCount: convo.unreadMsgCount + 1,
          };
        }else {
          // this is active chat
          return {
            ...convo,
            messages: [...convo.messages, message],
            latestMessageText: message.text,
            unreadMsgCount: 0
          };
        }
      }
      return {
        ...convo,
        messages: [...convo.messages, message],
        latestMessageText: message.text
      };
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      return {
        ...convo,
        id: message.conversationId,
        messages: [message],
        latestMessageText: message.text
      };
    } else {
      return convo;
    }
  });
};

export const resetUnreadMsgCount = (state, payload) => {
  return state.map((convo) => {
    if (convo.id === payload.convoId) {

      return {
        ...convo,
        messages: convo.messages.map(msg => {
          if (msg.senderId === convo.otherUser.id){
            return {
              ...msg,
              readByRecipient: true,
              isLastReadMessage: false,
            }
          }
          return msg
        }),
        unreadMsgCount: 0
      };
    }
    return convo;
  });
}

export const setMessageRead = (state, payload) => {
  return state.map((convo) => {
    if (convo.id === payload.conversationId) {
      return {
        ...convo,
        lastReadMsgId: payload.messageId
      };
    }
    return convo;
  });
}