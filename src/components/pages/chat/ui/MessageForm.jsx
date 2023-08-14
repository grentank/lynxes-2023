import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import SendIcon from '../../../ui/icons/SendIcon';

export default function MessageForm({ sendMessageHandler, startedWritingHandler }) {
  const [input, setInput] = useState('');
  const changeHandler = (e) => setInput(e.target.value);
  useEffect(() => {
    if(input.length !== 0) startedWritingHandler(true);
    else startedWritingHandler(false)
  }, [input])
  return (
    <Form onSubmit={sendMessageHandler}>
      <InputGroup className="mb-3">
        <Form.Control
          value={input}
          onChange={changeHandler}
          name="message"
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Text id="basic-addon2">
          <Button variant="outline-primary" type="submit">
            <SendIcon />
          </Button>
        </InputGroup.Text>
      </InputGroup>
    </Form>
  );
}
