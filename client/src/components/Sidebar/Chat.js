import React from "react";
import { Box, Chip } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { resetUnreadMessage } from "../../store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  },
  unreadChip: {
    background: "#3A8DFF",
    color: 'white',
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    // if there are unread messages, set them as read
    if (conversation.unreadMsgCount > 0){
      // find the last unread message
      let lastUnreadMsgId = 0
      for (const message of conversation.messages){
        if (message.senderId === conversation.otherUser.id){
          lastUnreadMsgId = message.id
        }
      }
      await props.resetUnreadMessage({
        conversationId: conversation.id, 
        senderId: conversation.otherUser.id,
        messageId: lastUnreadMsgId,
      })
    }
  };

  const renderUnreadCountChip = () => {
    if (conversation.unreadMsgCount > 0){
      return <Chip label={conversation.unreadMsgCount} size="small" color="#3a8dff" className={classes.unreadChip}/>
    }
    return null
  }

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {renderUnreadCountChip()}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    resetUnreadMessage: (conversationId) => {
      dispatch(resetUnreadMessage(conversationId))
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
