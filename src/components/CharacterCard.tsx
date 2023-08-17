import React from 'react';
import { Button, Card } from 'react-bootstrap';
import type { CardType } from '../types/card';
import type { OpenModalType } from '../types/modal';

type CharacterCardProps = {
  card: CardType;
  openModal: OpenModalType;
};

export default function CharacterCard({ card, openModal }: CharacterCardProps): JSX.Element {
  return (
    <Card className={card.clicked ? 'bg-info' : 'bg-light'}>
      <Card.Img variant="top" src={card.image} />
      <Card.Body>
        <Card.Title>{card.name}</Card.Title>
        <Card.Text>
          Gender: {card.gender}, Status: {card.status}, Type: {card.type}
        </Card.Text>
        <Button variant="primary" onClick={() => openModal(card)}>
          Reveal location
        </Button>
      </Card.Body>
    </Card>
  );
}
