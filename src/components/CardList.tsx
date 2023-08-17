import React from 'react';
import { Col, Row } from 'react-bootstrap';
import type { CardType } from '../types/card';
import CharacterCard from './CharacterCard';
import type { OpenModalType } from '../types/modal';

type CardListProps = {
  cards: CardType[];
  openModal: OpenModalType;
};

export default function CardList({ cards, openModal }: CardListProps): JSX.Element {
  return (
    <Row>
      {cards.map((card) => (
        <Col xs={6} md={4} key={card.id} className="mt-2">
          <CharacterCard card={card} openModal={openModal} />
        </Col>
      ))}
    </Row>
  );
}
