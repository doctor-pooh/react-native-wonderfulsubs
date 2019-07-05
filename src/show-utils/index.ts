import { Show, Season, Episode } from "../types";

export const findShow = (data: {
  showId;
  shows: { [key: string]: Show };
}): Show => {
  const { showId, shows } = data;
  const listOfShows = Object.values(shows);
  return listOfShows.find(({ id }) => id === showId);
};

export const findSeasonAndIndex = (data: {
  seasonId;
  show: Show;
}): { index: number; season: Season } => {
  const { seasonId, show } = data;
  let seasonIndex;
  const season = show.seasons && show.seasons.find(({ id }, index) => {
    seasonIndex = index;
    return id === seasonId;
  });
  return { index: seasonIndex, season };
};

export const findSeason = (data: { seasonId; show: Show }): Season => {
  const { season } = findSeasonAndIndex(data);
  return season;
};

export const findSeasonIndex = (data: { seasonId; show: Show }): number => {
  const { index } = findSeasonAndIndex(data);
  return index;
};

export const findEpisodeAndIndex = (data: {
  episodeId;
  seasonId?;
  show?: Show;
  season?: Season;
}): { index: number; episode: Episode } => {
  const { episodeId, seasonId, show, season } = data;
  let currentSeason;
  let episodeIndex;
  if (season === undefined && show) {
    currentSeason = findSeason({ seasonId, show });
  } else {
    currentSeason = season;
  }
  const episode = currentSeason && currentSeason.episodes.find(({ id }, index) => {
    episodeIndex = index;
    return id === episodeId;
  });
  return { index: episodeIndex, episode };
};

export const findEpisode = (data: {
  episodeId;
  seasonId?;
  show?: Show;
  season?: Season;
}): Episode => {
  const { episode } = findEpisodeAndIndex(data);
  return episode;
};

export const findNextEpisode = (data: {
  seasonId;
  episodeId;
  show: Show;
}): { season: Season; episode: Episode } => {
  const { episodeId, seasonId, show } = data;
  const currentSeason = findSeasonAndIndex({ seasonId, show });
  const currentEpisode = findEpisodeAndIndex({
    episodeId,
    season: currentSeason.season
  });
  let nextEpisodeIndex = currentEpisode.index;
  let nextSeasonIndex = currentSeason.index;

  if (nextEpisodeIndex + 1 < currentSeason.season.episodes.length - 1) {
    nextEpisodeIndex = nextEpisodeIndex + 1;
  } else if (nextSeasonIndex + 1 < show.seasons.length - 1) {
    nextSeasonIndex = nextSeasonIndex + 1;
    nextEpisodeIndex = 0;
  } else {
    return { season: undefined, episode: undefined };
  }

  const nextSeason = show.seasons[nextSeasonIndex];
  const nextEpisode = nextSeason.episodes[nextEpisodeIndex];
  return { season: nextSeason, episode: nextEpisode };
};
