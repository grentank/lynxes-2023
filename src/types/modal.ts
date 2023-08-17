import type { CardType } from './card';

export type ModalContentType = null | CardType;

export type OpenModalType = (card: CardType) => void;