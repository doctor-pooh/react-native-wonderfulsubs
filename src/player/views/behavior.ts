import { StackActions } from "react-navigation";
import * as reactActions from "../actions";
import { findNextEpisode, findEpisode } from "../../show-utils";

const NEXT_EPISODE_POPUP_STOPWATCH = 30;
const BUFFER_MS = 5000;
/*
 * If the buffer takes longer than we've got for video to watch,
 * then the video is stalled (bad source or bad internet)
 * 250ms is added in the odd event that the video buffer is just barely keeping
 * up and it is watchable without being stalled.
 */
const STALLED_MS = BUFFER_MS + 250;

// TODO: Add logic to check that an alternative source exists before requesting a new one

const setEpisodeWatched = function(watched) {
  const { showId, seasonId, episodeId } = this.props;
  (async () => {
    await global
      .__provider()
      .getSettings()
      .setEpisodeWatched({
        showId,
        seasonId,
        episodeId,
        finishedWatching: watched
      });
  })();
};

const playNextEpisode = function() {
  const {
    showId,
    seasonId,
    episodeId,
    fetchNextEpisode,
    shows: { showData },
    navigation
  } = this.props;

  const { episode: nextEpisode, season: nextSeason } = findNextEpisode({
    seasonId,
    episodeId,
    show: showData
  });

  if (nextEpisode && nextSeason) {
    fetchNextEpisode({ showId, seasonId, episodeId });
  } else {
    navigation.dispatch(
      StackActions.pop({
        n: 1
      })
    );
  }
};

export const onLoadStart = function() {
  const [_, dispatch] = this.context;
  dispatch(reactActions.setBufferedCount(0));
  dispatch(reactActions.setVideoLoading());
};

export const onLoad = function({ duration, naturalSize }) {
  const {
    seasonId,
    episodeId,
    shows: { showData },
    source = { name: "RapidShare" },
    popoverRef
  } = this.props;
  const [_, dispatch] = this.context;

  dispatch(reactActions.setVideoLoaded());
  const episode = findEpisode({
    seasonId,
    episodeId,
    show: showData
  });

  dispatch(reactActions.setVideoFinished(false));
  console.log(duration);
  dispatch(reactActions.setVideoInfo({ duration, naturalSize }));
  setEpisodeWatched.call(this, false);
  popoverRef.current.displayPopup(
    {
      lowerPopup: {
        videoInfo: `${source.name} - ${naturalSize.height}p`
      },
      episodePopup: {
        episode
      }
    },
    true,
    5000
  );
};

export const onProgress = function(progress: any) {
  const [state, dispatch] = this.context;
  const {
    video: { duration }
  } = state;
  const { updatedWatchingStatus, nextEpisodePoppedUp } = this.state;
  const {
    seasonId,
    episodeId,
    shows: { showData },
    popoverRef
  } = this.props;

  dispatch(reactActions.setTimeProgress(progress.currentTime));
  if (progress.currentTime / duration >= 0.8 && !updatedWatchingStatus) {
    setEpisodeWatched.call(this, true);
    this.setState({ updatedWatchingStatus: true });
  }
  if (
    duration - progress.currentTime <= NEXT_EPISODE_POPUP_STOPWATCH &&
    !nextEpisodePoppedUp
  ) {
    const { episode: nextEpisode } = findNextEpisode({
      seasonId,
      episodeId,
      show: showData
    }) || { episode: undefined };
    if (nextEpisode) {
      popoverRef.current.displayPopup(
        {
          episodePopup: {
            episode: nextEpisode,
            topText: "Next up...",
            showTimeLeft: true
          }
        },
        false
      );
    }
    this.setState({ nextEpisodePoppedUp: true });
  } else if (
    duration - progress.currentTime > NEXT_EPISODE_POPUP_STOPWATCH &&
    nextEpisodePoppedUp
  ) {
    popoverRef.current.dismissPopup();
    this.setState({ nextEpisodePoppedUp: false });
  }
};

export const onEnd = function() {
  const [_, dispatch] = this.context;
  const { popoverRef } = this.props;

  dispatch(reactActions.setVideoFinished(true));
  popoverRef.current.dismissPopup();
  playNextEpisode.call(this);
};

const stalledAction = function() {
  const { fetchSourceData, showId, seasonId, episodeId, source } = this.props;
  fetchSourceData({showId, seasonId, episodeId, stalledSourceId: source.id});
  console.log("fuckin stalled bro");
};

export const onBuffer = function({ isBuffering }) {
  if (isBuffering && !this.stalledTimer) {
    this.stalledTimer = setTimeout(stalledAction.bind(this), STALLED_MS);
  } else {
    this.stalledTimer = clearTimeout(this.stalledTimer);
  }
};

export const bufferConfig = {
  bufferForPlaybackMs: BUFFER_MS
};
