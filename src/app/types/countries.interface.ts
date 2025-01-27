export interface Country {
  id: string;
  name: string;
  area: string;
  localizacao: string;
  linguas: string;
}

export interface Countries {
  countriesList: Country[];
  countries: Country; //
}
