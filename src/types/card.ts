import type { CharacterType } from './character';

export type CardType = Omit<CharacterType, 'url' | 'created'> & {
  clicked: boolean;
};
