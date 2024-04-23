export interface ICountry {
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  cca2: string;
  cca3: string;
  name: {
    common: string;
    official: string;
    nativeName: Record<
      string,
      {
        official: string;
        common: string;
      }
    >;
  };
}

export type Suggestion = { name: string; value: string };
