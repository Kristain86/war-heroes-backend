interface IDeck {
  title: string;
  numberOfCards: number;
}

interface ISerie {
  title: string;
  icon: string;
  cards: { id: string }[];
}

interface IUSer {
  username: string;
  googleId: string;
}

interface ICard {
  id: string;
  name: string;
  type: string;
  element?: string;
  ability?: {
    name: string;
    cost: string | number;
    text: string;
  }[];
  attack?: number;
  life?: number;
  image: string;
}

declare interface Error {
  name: string;
  message: string;
  stack?: string;
  code?: number | string;
  errors: {
    properties: {
      [key: string]: {
        path: string;
        message: string;
      };
    };
  };
}
