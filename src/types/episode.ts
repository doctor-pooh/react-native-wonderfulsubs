export interface EpisodeDescription {
    picture: string,
    description: string
}

export interface Episode extends EpisodeDescription{
    id: number,
    name: string,
    episodeNumber: number,   
    watched: boolean,
    sources: [any]
}