import { Source } from "./source";

export interface EpisodeAttributes {
    dubbed: boolean;
    subbed: boolean;
}

export interface EpisodeDescription {
    picture: string,
    description: string,
    attributes?: EpisodeAttributes
}

export interface Episode extends EpisodeDescription{
    id: number,
    name: string,
    episodeNumber: number,
    sources: Source[],
    watched?: boolean,
    progress?: number
}