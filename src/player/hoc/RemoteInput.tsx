import React, { Component } from "react";
import { Text } from 'react-native';
import { FirestickKeys } from "../../components";
import { StateContext } from "../context";
import { Episode, Source } from "src/types";
import { PlayerPopover } from "../views";
import * as behavior from './behavior';
import {mapValues} from 'lodash';

interface Props {
  popoverRef: React.RefObject<PlayerPopover>;
  episode: Episode;
  source: Source;
  playerRef: any;
}

export default class RemoteInput extends Component<Props> {
  static contextType = StateContext;

  render() {
    return (
      <FirestickKeys
        keyPressTimeOut={250}
        {...mapValues(behavior, fn => fn.bind(this))}
      />
    );
  }
}
