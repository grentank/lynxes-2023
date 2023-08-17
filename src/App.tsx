import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import SearchForm from './components/SearchForm';
import CardList from './components/CardList';
import type { ApiReturnType, CharacterType } from './types/character';
import type { CardType } from './types/card';
import type { ModalContentType, OpenModalType } from './types/modal';
import ModalCard from './components/ModalCard';

function App(): JSX.Element {
  const [cards, setCards] = useState<CardType[]>([]);

  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const handleClose = (): void => setModalContent(null);
  const openModal: OpenModalType = (card) => {
    setModalContent(card);
    setCards((prev) =>
      prev.map((char) => (char.id === card.id ? { ...char, clicked: true } : char)),
    );
  };

  useEffect(() => {
    axios<ApiReturnType>('https://rickandmortyapi.com/api/character')
      .then((res) => {
        // console.log(res.data.results[0]);
        setCards(res.data.results.map((char) => ({ ...char, clicked: false })));
      })
      .catch(console.log);
  }, []);

  const submitHandler = async (input: string): Promise<void> => {
    try {
      if (!input.includes(',')) {
        const response = await axios<CharacterType>(
          `https://rickandmortyapi.com/api/character/${input}`,
        );
        setCards([{ ...response.data, clicked: false }]);
        return;
      }
      const response = await axios<CharacterType[]>(
        `https://rickandmortyapi.com/api/character/${input}`,
      );
      setCards(response.data.map((char) => ({ ...char, clicked: false })));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-3 mb-3">
        <Col xs={4}>
          <SearchForm submitHandler={submitHandler} />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={10}>
          <CardList cards={cards} openModal={openModal} />
        </Col>
      </Row>
      <ModalCard modalContent={modalContent} handleClose={handleClose} />
    </Container>
  );
}

export default App;
