import { matches, flattenDeep } from "lodash";
import { Provider } from "../providerAbstract";
import {
  Category,
  Show,
  Season,
  Episode,
  Source,
  SeasonType
} from "../../types";
import Settings from "../../settings/settingsAbstract";
import DefaultSettingsController from "../../settings/settings";

const fetch_retry = async (url, options, n) => {
  for (let i = 0; i < n; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      const isLastAttempt = i + 1 === n;
      // if (isLastAttempt) throw err;
    }
  }
};

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

const checkBookmarks = (
  shows: { [id: string]: ShowWithShortName },
  bookmarks
) => {
  for (const key of Object.keys(shows)) {
    shows[key] = {
      ...shows[key],
      bookmarked: bookmarks && !!bookmarks[key]
    };
  }
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

export default class WonderfulSubs extends Provider {
  public key = "wonderfulsubs";
  public categories = [
    { name: "Bookmarks", type: "bookmarks" },
    { name: "Popular", type: "popular" },
    { name: "Latest", type: "latest" }
  ];
  public maxShowsToFetch = 120;
  private showData: {
    [category: string]: { [id: string]: ShowWithShortName };
  } = {};

  private showPageIndex: { [category: string]: number } = {};
  private currentCategory = this.categories[0].type;

  constructor(settings: Settings = new DefaultSettingsController()) {
    super(settings);
    settings.on("setEpisodeWatched", this.onShowWatched.bind(this));
    settings.on("bookmarkAdded", this.onBookmarkAdded.bind(this));
    settings.on("bookmarkRemoved", this.onBookmarkRemoved.bind(this));
  }

  onShowWatched({ showId, seasonId, episodeId, finishedWatching }) {
    if (showId && seasonId !== undefined && episodeId !== undefined) {
      const season = this.showData[this.currentCategory][showId].seasons.find(
        ({ id }) => id === seasonId
      );
      const episode = season.episodes.find(({ id }) => id === episodeId);
      episode.watched = finishedWatching;
    }
  }

  onBookmarkAdded({ bookmarks }) {
    this.showData["bookmarks"] = bookmarks;
  }

  onBookmarkRemoved({ bookmarks }) {
    this.showData["bookmarks"] = bookmarks;
  }

  getSettings(): Settings {
    return this.settings;
  }

  setSettings(settings: Settings): Settings {
    this.settings = settings;
    return this.settings;
  }

  async fetchShows({
    type = "latest"
  }: Category): Promise<{ [id: string]: Show }> {
    if (type === "bookmarks") {
      this.currentCategory = type;
      return await this.fetchBookmarks();
    }
    if (this.showPageIndex[type] && type === this.currentCategory) {
      return this.fetchMoreShows(<Category>{ type });
    }
    if (!this.showData[type]) {
      const url = new URL(type, "https://www.wonderfulsubs.com/api/v1/media/");
      url.searchParams.append("count", "24");
      console.log(url.href);
      const response = await fetch_retry(url.href, undefined, 3);
      const json = await response.json();
      const showData = this.translateShows(json);
      this.showData[type] = showsToLookupTable(showData);
      this.showPageIndex[type] = 24;
    }
    this.currentCategory = type;
    checkBookmarks(this.showData[type], this.showData["bookmarks"]);
    return this.showData[type];
  }

  private async fetchBookmarks(): Promise<{ [id: string]: Show }> {
    if (!this.showData["bookmarks"]) {
      this.showData["bookmarks"] = <{ [id: string]: ShowWithShortName }>(
        await this.settings.getBookmarks()
      );
    }
    return this.showData["bookmarks"];
  }

  private async fetchMoreShows({
    type
  }: Category): Promise<{ [id: string]: Show }> {
    if (Object.keys(this.showData[type]).length < this.maxShowsToFetch) {
      const startIndex = this.showPageIndex[type];
      const url = new URL(type, "https://www.wonderfulsubs.com/api/v1/media/");
      url.searchParams.append("index", `${startIndex}`);
      url.searchParams.append("count", "24");
      const response = await fetch_retry(url.href, undefined, 3);
      const json = await response.json();
      const showData = showsToLookupTable(
        this.translateShows(json, startIndex)
      );
      this.showData[type] = { ...this.showData[type], ...showData };
      this.showPageIndex[type] = 24 + this.showPageIndex[type];
    }
    const bookmarkedShows = await this.settings.getBookmarks();
    checkBookmarks(this.showData[type], this.showData["bookmarks"]);
    return this.showData[type];
  }

  async searchShows(target: {
    query: string;
  }): Promise<{ [id: string]: Show }> {
    const { query } = target;
    const url = new URL("https://www.wonderfulsubs.com/api/v1/media/search");
    url.searchParams.append("q", query);
    const response = await fetch_retry(url.href, undefined, 3);
    const json = await response.json();
    this.currentCategory = "search";
    this.showData[this.currentCategory] = showsToLookupTable(
      this.translateShows(json)
    );
    const bookmarkedShows = await this.settings.getBookmarks();
    checkBookmarks(
      this.showData[this.currentCategory],
      this.showData["bookmarks"]
    );
    return this.showData[this.currentCategory];
  }

  async fetchShowDecription(target: { showId: string }): Promise<Show> {
    const { showId } = target;
    return this.showData[this.currentCategory][showId];
  }

  async fetchSeasons(target: { showId: string }): Promise<Show> {
    const { showId } = target;
    const show = <ShowWithShortName>this.showData[this.currentCategory][showId];
    if (show.seasonsFetched) {
      return show;
    }
    const url = new URL("https://www.wonderfulsubs.com/api/v1/media/series");
    url.searchParams.append("series", show.shortName || show.id);
    console.log(url.href);
    const response = await fetch_retry(url.href, undefined, 3);
    const json = await response.json();
    const episodesWatched = async seasonId =>
      await this.settings.getEpisodesWatched({ showId, seasonId });
    const translatedSeasons = await this.translateSeasons(
      json,
      episodesWatched
    );
    this.showData[this.currentCategory][showId] = {
      ...show,
      seasonsFetched: true,
      seasons: translatedSeasons
    };
    return this.showData[this.currentCategory][showId];
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
    const normalizeEncoding = params => {
      let decode = params;
      while(/%[0-9a-f]{2}/i.test(decodeURIComponent(decode))) {
        decode = decodeURIComponent(decode);
      }
      return decode;
    }
    const { showId, seasonId, episodeId } = target;
    const show = this.showData[this.currentCategory][showId];
    const season = show.seasons[seasonId];
    const episode = season.episodes[episodeId];
    let sources = [...episode.sources];
    let json;
    let preferredSourceToFetch: SourceWithFetchUrl;
    let status;
    do {
      const { source, index } = this.findIdealSource(sources);
      preferredSourceToFetch = <SourceWithFetchUrl>source;
      if (preferredSourceToFetch.sourcesFetched) {
        return { data: show, source: preferredSourceToFetch };
      }
      let encoded = normalizeEncoding(preferredSourceToFetch.fetchUrl);
      const url = new URL("https://www.wonderfulsubs.com/api/v1/media/stream");
      url.searchParams.append("code", encoded);
      console.log(url.href);
      const response = await fetch_retry(url.href, undefined, 3);
      json = await response.json();
      status = json.status;
      if (status === 404) {
        sources = sources.filter((_, i) => i !== index);
      }
    } while (sources.length > 0 && status === 404);
    const translatedSource = this.translateSources(
      json,
      preferredSourceToFetch
    );
    episode.sources[translatedSource.id] = translatedSource;
    return { data: show, source: translatedSource };
  }

  private findIdealSource = (
    sources: Source[]
  ): { index: number; source: Source } => {
    const defaultSource = sources[0];
    const priority = [
      matches({ name: "ka", language: "dubs" }),
      matches({ name: "fa", language: "dubs" }),
      matches({ language: "dubs" })
    ];
    let idealSource: Source;
    let foundIndex = 0;
    priority.forEach(matcher => {
      if (!idealSource) {
        idealSource = sources.find((src, index) => {
          const matched = matcher(src);
          if (matched) {
            foundIndex = index;
          }
          return matched;
        });
      }
    });
    !idealSource && console.log("No ideal source found!");
    return { index: foundIndex, source: idealSource || defaultSource };
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
          seasonsFetched: false,
          attributes: {
            dubbed: show.is_dubbed,
            subbed: show.is_subbed,
            rating: show.rating
          }
        }
    );
  };

  private translateSeasons = async (
    {
      json: {
        seasons: {
          ws: { media = [] }
        }
      }
    },
    episodesWatched
  ): Promise<Season[]> => {
    if (media.length === 1 && media[0].type === "episodes") {
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
            episodes: this.translateEpisodes(
              episodesList.slice(start, end),
              await episodesWatched(slice)
            )
          };
          seasonList.push(season);
        }
        return seasonList;
      }
      const season1: Season = {
        id: 0,
        seasonName: `1 to ${episodesList.length}`,
        type: SeasonType.episodes,
        episodes: this.translateEpisodes(episodesList, await episodesWatched(0))
      };
      return [season1];
    }
    const seasons = media.map((season, index): Season => {
      const { episodes, title, type } = season;
      return {
        id: index,
        seasonName: title,
        type,
        episodes: this.translateEpisodes(episodes, episodesWatched(index))
      }
    })
    return seasons;
  };

  private translateEpisodes = (episodes = [], watchedEpisodes) => {
    const stubSources = ({
      sources,
      retrieve_url
    }): { subbed: boolean; dubbed: boolean; sources: Source[] } => {
      let subbed = false,
        dubbed = false;
      let sourceList: SourceWithFetchUrl[] = [];
      if (retrieve_url) {
        sourceList = [
          <SourceWithFetchUrl>{
            id: 0,
            sourcesFetched: false,
            name: "unk",
            language: "unk",
            fetchUrl: Array.isArray(retrieve_url) ? retrieve_url[0] : retrieve_url
          }
        ]
      } else {
        sourceList = <SourceWithFetchUrl[]>sources.map(
          (source: any, index: number) => {
            if (source.language === "subs") {
              subbed = true;
            } else if (source.language === "dubs") {
              dubbed = true;
            }
            const retrieveUrls = Array.isArray(source.retrieve_url) ? source.retrieve_url : [source.retrieve_url]
            return <SourceWithFetchUrl[]>retrieveUrls.map(fetchUrl => ({
              id: index,
              sourcesFetched: false,
              name: source.source,
              language: source.language,
              fetchUrl
            }));
          }
        );
      }
      return { subbed, dubbed, sources: flattenDeep(sourceList) };
    };

    return <Episode[]>episodes.map((episode: any, index: number) => {
      const { sources, subbed, dubbed } = stubSources(episode);
      return <Episode>{
        id: index,
        name: episode.title,
        episodeNumber: episode.episode_number,
        description: episode.description,
        picture:
          episode.thumbnail &&
          episode.thumbnail.length &&
          indexOrGoodEnough(episode.thumbnail, 0).source,
        sources,
        watched: watchedEpisodes && !!watchedEpisodes[index],
        attributes: {
          dubbed,
          subbed
        }
      };
    });
  };
}
