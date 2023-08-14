import React from 'react';
import { Stack } from 'react-bootstrap';
import MessageForm from './MessageForm';
import MessagesList from './MessagesList';

export default function ChatComponent({ startedWritingHandler, writer, messages, loggedUser, sendMessageHandler }) {
  return (
    <Stack>
      <MessagesList messages={messages} loggedUser={loggedUser} />
      <div className="fs-6 fw-light">{writer === null ? `\xa0` : `${writer.name} печатает...`}</div>
      <MessageForm startedWritingHandler={startedWritingHandler} sendMessageHandler={sendMessageHandler} />
    </Stack>
  );
}
