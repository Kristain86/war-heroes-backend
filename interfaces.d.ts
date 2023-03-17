interface IDeck {
  title: string;
  numberOfCards: number;
}

interface IUSer {
  username: string;
  googleId: string;
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
