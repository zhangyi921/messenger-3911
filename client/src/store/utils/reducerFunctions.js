import store from '../index'

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  debugger
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
      if (message.senderId === convo.otherUser.id){
        let activeConversation = store.getState().activeConversation
        // inactive chat, increament unReadMsgCount
        if (activeConversation !== convo.otherUser.username){
          return {
            ...convo,
            messages: [...convo.messages, message],
            latestMessageText: message.text,
            unreadMsgCount: convo.unreadMsgCount + 1,
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

export const loadConvosToStore = (state, conversations) => {
  const convosCopy = [...conversations]

  // find last read messages & count of unread messages
  for (const convo of convosCopy){
    let unreadMsgCount = 0
    for (let i = 0; i< convo.messages.length; i++){
      const currentMessage = convo.messages[i]
      const nextMessage = convo.messages[i+1]
      let isLastReadMessage
      if (nextMessage === undefined){
        // this is the last msg
        isLastReadMessage = currentMessage.readByRecipient
      }else {
        // last read msg if current msg is read and next msg is unread
        isLastReadMessage = currentMessage.readByRecipient && !nextMessage.readByRecipient
      }
      const isMyMessage = currentMessage.senderId !== convo.otherUser.id
      if (isMyMessage && isLastReadMessage){
        currentMessage.isLastReadMessage = true
      }
      if (!isMyMessage && !currentMessage.readByRecipient){
        unreadMsgCount += 1
      }
    }
    convo.unreadMsgCount = unreadMsgCount
  }
  return convosCopy
};

