import React from "react";

interface MessageListProps {
  messages: string[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((msg, idx) => (
        <div key={idx} className="message">
          {msg}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
