import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import UsersList from './ui/UsersList';
import ChatComponent from './ui/ChatComponent';
// import useWs from '../../customHooks/useWs';

// const initUsers = [{ name: 'Alex' }, { name: 'Bob' }, { name: 'Carl' }];

export default function ChatPage({ messages: initMessages, user: loggedUser }) {
  const [messages, setMessages] = useState(initMessages);
  const [users, setUsers] = useState([]);
  const [writer, setWriter] = useState(null);

  const socketRef = useRef(null); // {current: null}

  useEffect(() => {
    function useWs() {
      const socket = new WebSocket('ws://localhost:3000');
      socket.onopen = (e) => {
        console.log('Socket opened');
      };
      socket.onclose = (e) => {
        console.log('Socket closed');
        setTimeout(() => {
          const newSocket = useWs();
          socketRef.current = newSocket;
        }, 2000);
      };
      socket.onerror = (e) => {
        console.log('Socket error');
      };
      socket.onmessage = (e) => {
        const action = e.data;
        const { type, payload } = JSON.parse(action);
        switch (type) {
          case 'SET_USERS':
            setUsers(payload);
            break;
          case 'ADD_MESSAGE':
            setMessages((prev) => [...prev, payload]);
            break;
          case 'SET_WRITER':
            setWriter(payload);
            break;
          default:
            break;
        }
      };
      return socket;
    }
    const socket = useWs();
    socketRef.current = socket;
  }, []);

  const sendMessageHandler = (event) => {
    event.preventDefault();
    const { message } = Object.fromEntries(new FormData(event.target));
    socketRef.current.send(JSON.stringify({ type: 'NEW_MESSAGE', payload: message }));
    event.target.reset();
  };

  const startedWritingHandler = (startedTyping) => {
    if (!socketRef.current) return;
    if (startedTyping) socketRef.current.send(JSON.stringify({ type: 'STARTED_TYPING' }));
    else socketRef.current.send(JSON.stringify({ type: 'STOPPED_TYPING' }));
  };

  return (
    <Container>
      <Row>
        <Col xs={2}>
          <UsersList users={users} />
        </Col>
        <Col xs={10}>
          <ChatComponent
            startedWritingHandler={startedWritingHandler}
            writer={writer}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            loggedUser={loggedUser}
          />
        </Col>
      </Row>
    </Container>
  );
}
