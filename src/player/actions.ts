export function setTimeDelta(time) {
    return {
        type: "SET_TIME_PROGRESS_DELTA",
        payload: time
    };
};

export function togglePaused() {
    return {
        type: "TOGGLE_PAUSED"
    };
}

export function setTimeProgress(progress) {
    return {
        type: "SET_TIME_PROGRESS",
        payload: progress
    };
}

export function setVideoInfo(data) {
    return {
        type: "SET_VIDEO_INFO",
        payload: data
    };
}

export function setVideoFinished(finished) {
    return {
        type: "SET_VIDEO_FINISHED",
        payload: finished
    };
}