import React, { Component } from "react";
import KeepAwake from "react-native-keep-awake";
import { FirestickKeys } from "../../components";
import { StateContext } from "../context";
import * as reactActions from "../actions";
import { prettyTime } from "../utils";
import { Episode } from "src/types";
import { PlayerPopover } from "../views";

interface Props {
  popoverRef: React.RefObject<PlayerPopover>;
  episode: Episode;
  playerRef: any;
}

export default class RemoteInput extends Component<Props> {
  static contextType = StateContext;

  render() {
    const [state, dispatch] = this.context;
    const { popoverRef } = this.props;

    const onRight = () => {
      const [
        {
          video: { progress, duration, delta }
        }
      ] = this.context;
      const forwardAmt = delta || 10;
      if (progress + forwardAmt < duration) {
        this.props.playerRef.current.seek(forwardAmt + progress);
      } else {
        this.props.playerRef.current.seek(duration);
      }
      dispatch(reactActions.setTimeDelta(0));
      popoverRef.current.displayPopup({
        lowerPopup: {
          icon: "forward",
          text: prettyTime(forwardAmt)
        }
      });
    };

    const onRightHold = () => {
      const [
        {
          video: { progress, duration, delta }
        }
      ] = this.context;
      const step = delta >= 60 ? 30 : 10;
      let forwardAmt = delta + step;
      if (progress + forwardAmt > duration) {
        forwardAmt = duration - progress;
      }
      dispatch(reactActions.setTimeDelta(forwardAmt));
      popoverRef.current.displayPopup(
        {
          lowerPopup: {
            icon: "forward",
            text: prettyTime(forwardAmt)
          }
        },
        false
      );
    };

    const onLeft = () => {
      const [
        {
          video: { progress, delta }
        }
      ] = this.context;
      const reverseAmt = delta || -10;
      if (progress + reverseAmt >= 0) {
        this.props.playerRef.current.seek(reverseAmt + progress);
      } else {
        this.props.playerRef.current.seek(0);
      }
      dispatch(reactActions.setTimeDelta(0));
      popoverRef.current.displayPopup({
        lowerPopup: {
          icon: "backward",
          text: prettyTime(Math.abs(reverseAmt))
        }
      });
    };

    const onLeftHold = () => {
      const [
        {
          video: { progress, delta }
        }
      ] = this.context;
      const step = delta <= -60 ? -30 : -10;
      let reverseAmt = delta + step;
      if (progress + reverseAmt < 0) {
        reverseAmt = -1 * progress;
      }
      dispatch(reactActions.setTimeDelta(reverseAmt));
      popoverRef.current.displayPopup(
        {
          lowerPopup: {
            icon: "backward",
            text: prettyTime(Math.abs(reverseAmt))
          }
        },
        false
      );
    };

    const onPlay = () => {
      const [
        {
          video: { paused }
        }
      ] = this.context;
      dispatch(reactActions.togglePaused());
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
            ...displayobj
          },
          episodePopup: {
            episode: this.props.episode
          }
        },
        paused
      );
    };

    return (
      <FirestickKeys
        keyPressTimeOut={250}
        onPlay={onPlay}
        onLeftHold={onLeftHold}
        onLeft={onLeft}
        onRightHold={onRightHold}
        onRight={onRight}
        onSelect={() => {
          popoverRef.current.displayPopup(
            {
              lowerPopup: {},
              episodePopup: {
                episode: this.props.episode
              }
            },
            true,
            5000
          );
        }}
      />
    );
  }
}
