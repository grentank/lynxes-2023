export type ApiReturnType = {
  info: ApiInfoType;
  results: CharacterType[];
};

export type ApiInfoType = {
  count: number;
  next: string;
};

export type CharacterType = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: Date;
};

export type Location = {
  name: string;
  url: string;
};
