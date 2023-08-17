import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import SendIcon from './icons/SendIcon';

type SearchFormProps = {
  submitHandler: (input: string) => Promise<void>;
};

export default function SearchForm({ submitHandler }: SearchFormProps): JSX.Element {
  const [input, setInput] = useState('');
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    setInput(event.target.value);

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        void submitHandler(input);
      }}
    >
      <InputGroup className="mb-3">
        <Form.Control
          onChange={changeHandler}
          value={input}
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Text id="basic-addon2">
          <Button type="submit">
            <SendIcon />
          </Button>
        </InputGroup.Text>
      </InputGroup>
    </Form>
  );
}
