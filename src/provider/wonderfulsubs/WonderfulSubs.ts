import { matches } from "lodash";
import { Provider } from "../providerInterface";
import {
  Category,
  Show,
  Season,
  Episode,
  Source,
  SeasonType
} from "../../types";

const showShortName = ({ url }) => {
  return url.substring(url.indexOf("watch/") + 6);
};

const showsToLookupTable = (
  shows: Show[]
): { [id: string]: ShowWithShortName } => {
  let objectMap = {};
  shows.forEach((show: Show) => {
    objectMap[show.id] = show;
  });
  return objectMap;
};

const indexOrGoodEnough = (array, ideal) => {
  if (array.length - 1 < ideal) {
    return array[array.length - 1];
  }
  return array[ideal];
};

interface SourceWithFetchUrl extends Source {
  sourcesFetched: boolean;
  fetchUrl: string;
}

interface ShowWithShortName extends Show {
  seasonsFetched: boolean;
  shortName: string;
}

export default class WonderfulSubs implements Provider {
  public key = "wonderfulsubs";
  public categories = [
    { name: "Popular", type: "popular" },
    { name: "Latest", type: "latest" }
  ];
  private settings: object;
  private showData: { [id: string]: ShowWithShortName };

  private showPageIndex = undefined;
  private currentCategory = this.categories[0].type;

  constructor(settings: object = undefined) {
    this.settings = settings;
  }

  getSettings(): object {
    return this.settings;
  }

  setSettings(settings: object): object {
    this.settings = settings;
    return this.settings;
  }

  async fetchShows({
    type = "latest"
  }: Category): Promise<{ [id: string]: Show }> {
    if (this.showPageIndex && type === this.currentCategory) {
      return this.fetchMoreShows(<Category>{ type });
    }
    const response = await fetch(
      `https://www.wonderfulsubs.com/api/v1/media/${type}?count=24`
    );
    this.currentCategory = type;
    const json = await response.json();
    const showData = this.translateShows(json);
    this.showData = showsToLookupTable(showData);
    this.showPageIndex = 24;
    return this.showData;
  }

  private async fetchMoreShows({
    type
  }: Category): Promise<{ [id: string]: Show }> {
    const startIndex = this.showPageIndex;
    const response = await fetch(
      `https://www.wonderfulsubs.com/api/v1/media/${type}?index=${startIndex}&count=24`
    );
    const json = await response.json();
    const showData = showsToLookupTable(this.translateShows(json, startIndex));
    this.showData = { ...this.showData, ...showData };
    this.showPageIndex = 24 + this.showPageIndex;
    return this.showData;
  }

  async searchShows(target: {
    query: string;
  }): Promise<{ [id: string]: Show }> {
    const { query } = target;
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://www.wonderfulsubs.com/api/v1/media/search?q=${encodedQuery}`
    );
    const json = await response.json();
    this.showData = showsToLookupTable(this.translateShows(json));
    this.showPageIndex = undefined;
    return this.showData;
  }

  async fetchShowDecription(target: { showId: string }): Promise<Show> {
    const { showId } = target;
    return this.showData[showId];
  }

  async fetchSeasons(target: { showId: string }): Promise<Show> {
    const { showId } = target;
    const show = <ShowWithShortName>this.showData[showId];
    if (show.seasonsFetched) {
      return show;
    }
    const response = await fetch(
      `https://www.wonderfulsubs.com/api/v1/media/series?series=${
        show.shortName
      }`
    );
    const json = await response.json();
    const translatedSeasons = this.translateSeasons(json);
    this.showData[showId] = {
      ...show,
      seasonsFetched: true,
      seasons: translatedSeasons
    };
    return this.showData[showId];
  }

  async fetchEpisodes(target: {
    showId: string;
    seasonId: number;
  }): Promise<Show> {
    throw new Error("Method not implemented.");
  }

  fetchEpisodeDescription(target: {
    showId: string;
    seasonId: number;
    episodeId: number;
  }): Promise<Show> {
    throw new Error("Method not implemented.");
  }

  async fetchSources(target: {
    showId: string;
    seasonId: number;
    episodeId: number;
  }): Promise<{ data: Show; source: Source }> {
    const { showId, seasonId, episodeId } = target;
    const show = this.showData[showId];
    const season = show.seasons[seasonId];
    const episode = season.episodes[episodeId];
    const preferredSourceToFetch: SourceWithFetchUrl = <SourceWithFetchUrl>(
      this.findIdealSource(episode.sources)
    );
    if (preferredSourceToFetch.sourcesFetched) {
      return { data: show, source: preferredSourceToFetch };
    }
    const response = await fetch(
      `https://www.wonderfulsubs.com/api/v1/media/stream?code=${
        preferredSourceToFetch.fetchUrl
      }`
    );
    const json = await response.json();
    const translatedSource = this.translateSources(
      json,
      preferredSourceToFetch
    );
    episode.sources[translatedSource.id] = translatedSource;
    return { data: show, source: translatedSource };
  }

  private findIdealSource = (sources: Source[]): Source => {
    const defaultSource = sources[0];
    const priority = [
      matches({ name: "ka", language: "dubs" }),
      matches({ name: "fa", language: "dubs" }),
      matches({ language: "dubs" })
    ];
    let idealSource: Source;
    priority.forEach(matcher => {
      if (!idealSource) {
        idealSource = sources.find(matcher);
      }
    });
    return idealSource || defaultSource;
  };

  private translateSources = (
    { urls = [] },
    source: SourceWithFetchUrl
  ): SourceWithFetchUrl => {
    const bestQuality = urls[urls.length - 1];
    return {
      ...source,
      url: bestQuality.src,
      quality: bestQuality.label,
      sourcesFetched: true
    };
  };

  private translateShows = (
    { json: { series = [] } },
    indexOffset = 0
  ): ShowWithShortName[] => {
    return <ShowWithShortName[]>series.map(
      (show: any, index: number) =>
        <ShowWithShortName>{
          id: showShortName(show),
          provider: this.key,
          name: show.title,
          description: show.description,
          picture:
            show.poster_tall &&
            show.poster_tall.length &&
            indexOrGoodEnough(show.poster_tall, 2).source,
          wallArt:
            show.poster_wide &&
            show.poster_wide.length &&
            indexOrGoodEnough(show.poster_wide, 4).source,
          shortName: showShortName(show),
          seasonsFetched: false
        }
    );
  };

  private translateSeasons = ({
    json: {
      seasons: {
        ws: { media = [] }
      }
    }
  }): Season[] => {
    const type = media[0].type;
    if (type === "episodes") {
      const episodesList: object[] = media[0].episodes || [];
      if (episodesList.length > 50) {
        const seasonSlices = episodesList.length / 50;
        let seasonList = [];
        for (let slice = 0; slice < seasonSlices; slice++) {
          const start = 50 * slice;
          const end =
            start + 50 > episodesList.length ? episodesList.length : start + 50;
          const season: Season = {
            id: slice,
            type: SeasonType.episodes,
            seasonName: `${start + 1} to ${end}`,
            episodes: this.translateEpisodes(episodesList.slice(start, end))
          };
          seasonList.push(season);
        }
        return seasonList;
      }
      const season1: Season = {
        id: 0,
        seasonName: `1 to ${episodesList.length}`,
        type: SeasonType.episodes,
        episodes: this.translateEpisodes(episodesList)
      };
      return [season1];
    }
    return [];
  };

  private translateEpisodes = (episodes = []) => {
    const stubSources = ({ sources = [] }): Source[] => {
      return <SourceWithFetchUrl[]>sources.map(
        (source: any, index: number) =>
          <SourceWithFetchUrl>{
            id: index,
            sourcesFetched: false,
            name: source.source,
            language: source.language,
            fetchUrl: Array.isArray(source.retrieve_url)
              ? source.retrieve_url[0]
              : source.retrieve_url
          }
      );
    };

    return <Episode[]>episodes.map(
      (episode: any, index: number) =>
        <Episode>{
          id: index,
          name: episode.title,
          episodeNumber: episode.episode_number,
          description: episode.description,
          picture:
            episode.thumbnail &&
            episode.thumbnail.length &&
            indexOrGoodEnough(episode.thumbnail, 0).source,
          sources: stubSources(episode)
        }
    );
  };
}
