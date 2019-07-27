import KeepAwake from "react-native-keep-awake";
import { prettyTime } from "../utils";
import * as reactActions from "../actions";

export const onRight = function({doubleTap}) {
    const [state, dispatch] = this.context;
    let { playerRef, popoverRef } = this.props;
    let { video: { paused, progress, duration, delta } } = state;

    let forwardAmt = delta || 10;
    if (doubleTap) {
        const timeSlices = new Array(4).fill(0).map((_,i) => (i+1) * (duration/4));
        const nearest = timeSlices.find(slice => slice > progress);
        forwardAmt = nearest - progress;
    }
    if (progress + forwardAmt < duration) {
        playerRef.current.seek(forwardAmt + progress);
    } else {
        playerRef.current.seek(duration);
    }
    popoverRef.current.displayPopup({
        lowerPopup: {
            icon: "forward",
            text: prettyTime(forwardAmt)
        }
    }, true, 5000);
    dispatch(reactActions.setTimeDelta(0));
};

export const onRightHold = function() {
    const [state, dispatch] = this.context;
    let { popoverRef } = this.props;
    let { video: { progress, duration, delta } } = state;

    const step = delta >= 60 ? 30 : 10;
    let forwardAmt = delta + step;
    if (progress + forwardAmt > duration) {
        forwardAmt = duration - progress;
    }
    popoverRef.current.displayPopup(
        {
            lowerPopup: {
                icon: "forward",
                text: prettyTime(forwardAmt)
            }
        },
        false
    );
    dispatch(reactActions.setTimeDelta(forwardAmt));
};

export const onLeft = function({doubleTap}) {
    const [state, dispatch] = this.context
    let { playerRef, popoverRef } = this.props;
    let { video: { progress, delta, duration } } = state;

    let reverseAmt = delta || -10;
    if (doubleTap) {
        const timeSlices = new Array(4).fill(0).map((_,i) => (i+1) * (duration/4));
        const nearest = timeSlices.reverse().find(slice => slice < (progress - 4)) || 0;
        reverseAmt = nearest - progress;
    }
    if (progress + reverseAmt >= 0) {
        playerRef.current.seek(reverseAmt + progress);
    } else {
        playerRef.current.seek(0);
    }
    popoverRef.current.displayPopup({
        lowerPopup: {
            icon: "backward",
            text: prettyTime(Math.abs(reverseAmt))
        }
    }, true, 5000);
    dispatch(reactActions.setTimeDelta(0));
};

export const onLeftHold = function() {
    const [state, dispatch] = this.context
    let { popoverRef } = this.props;
    let { video: { progress, delta } } = state;

    const step = delta <= -60 ? -30 : -10;
    let reverseAmt = delta + step;
    if (progress + reverseAmt < 0) {
        reverseAmt = -1 * progress;
    }
    popoverRef.current.displayPopup(
        {
            lowerPopup: {
                icon: "backward",
                text: prettyTime(Math.abs(reverseAmt))
            }
        },
        false
    );
    dispatch(reactActions.setTimeDelta(reverseAmt));
};

export const onPlay = function() {
    const [state, dispatch] = this.context
    let { popoverRef, episode, source } = this.props;
    let { video: { paused, naturalSize } } = state;

    const safeSource = source || { name: 'unknown' };
    let displayobj;
    if (paused) {
        displayobj = { icon: "play", text: "Play" };
        KeepAwake.activate();
    } else {
        displayobj = { icon: "pause", text: "Paused" };
        KeepAwake.deactivate();
    }
    popoverRef.current.displayPopup(
        {
            lowerPopup: {
                ...displayobj,
                videoInfo: `${safeSource.name} - ${naturalSize.height}p`
            },
            episodePopup: {
                episode: episode
            }
        },
        paused
    );
    dispatch(reactActions.togglePaused());
};

export const onSelect = function() {
    let { popoverRef, episode } = this.props;
    popoverRef.current.displayPopup(
        {
            lowerPopup: {},
            episodePopup: {
                episode
            }
        },
        true,
        5000
    );
};