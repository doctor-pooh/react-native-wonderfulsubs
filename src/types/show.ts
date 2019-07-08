import { Season } from "./season";

export interface ShowAttributes {
  dubbed: boolean;
  subbed: boolean;
  rating: string;
}

export interface ShowDescription {
  description: string;
  wallArt: string;
}

export interface ShowCoreInformation {
  picture: string;
  name: string;
  description: string;
  seasons: Season[];
  bookmarked?: boolean;
  attributes?: ShowAttributes;
}

export interface Show extends ShowDescription, ShowCoreInformation {
  id: string;
  provider: string;
}
