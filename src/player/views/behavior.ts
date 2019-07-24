
import { StackActions } from "react-navigation";
import * as reactActions from "../actions";
import { findNextEpisode, findEpisode } from "../../show-utils";

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

export const onLoad = function({ duration, naturalSize }) {
    const {
        seasonId,
        episodeId,
        shows: { showData },
        source = { name: 'RapidShare' },
        popoverRef
    } = this.props;
    const [_, dispatch] = this.context;
    const episode = seasonId && episodeId && findEpisode({
        seasonId,
        episodeId,
        show: showData
      });
      
    dispatch(reactActions.setVideoFinished(false));
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
    if (
        progress.currentTime / duration >= 0.9 &&
        !updatedWatchingStatus
    ) {
        setEpisodeWatched.call(this, true);
        this.setState({ updatedWatchingStatus: true });
    }
    if (duration - progress.currentTime <= 15 && !nextEpisodePoppedUp) {
        const { episode: nextEpisode } = seasonId && episodeId && findNextEpisode({
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
        duration - progress.currentTime > 15 &&
        nextEpisodePoppedUp
    ) {
        popoverRef.current.dismissPopup();
        this.setState({ nextEpisodePoppedUp: false });
    }
};

export const onEnd = function() {
    const [_, dispatch] = this.context;
    const {
        popoverRef
    } = this.props;

    dispatch(reactActions.setVideoFinished(true));
    popoverRef.current.dismissPopup();
    playNextEpisode.call(this);
};