import React, { Component } from "react";
import { View } from "react-native";
import { DeviceEventEmitter } from "react-native";
import KeyMappings from "./KeyMappings";

export default class FirestickKeys extends Component {
  timer = undefined;

  throttle(callback, wait, immediate = false) {
    this.timer = null;
    let initialCall = true;

    return () => {
      const callNow = immediate && initialCall;
      const next = () => {
        callback.apply(this, arguments);
        this.timer = null;
      };

      if (callNow) {
        initialCall = false;
        next();
      }

      if (!this.timer) {
        this.timer = setTimeout(next, wait);
      }
    };
  }

  buildProps = () => {
    return Object.keys(this.props).reduce((mappings, propName) => {
      if (KeyMappings[propName] && typeof this.props[propName] === "function") {
        const holdDown = KeyMappings[propName].holdDown;
        const keyCode = KeyMappings[propName].keyCode;
        const key = holdDown ? `${keyCode}_hold` : keyCode;

        let action = this.props[propName];

        if (holdDown) {
          action = this.throttle(action, this.props.keyPressTimeOut, true);
        }
        return {
          ...mappings,
          [key]: {
            action,
            holdDown
          }
        };
      }
      return mappings;
    }, {});
  };

  render() {
    return <View />;
  }

  _enableEventHandler = () => {
    const mappedProps = this.buildProps();
    let throttledKeyDown;
    this.listenerKeyUp = DeviceEventEmitter.addListener(
      "onKeyUp",
      ({ keyCode = 0 }) => {
        if (mappedProps && mappedProps[keyCode]) {
          mappedProps[keyCode].action();
        }
        if (throttledKeyDown && throttledKeyDown.keyCode === keyCode) {
          this.timer = clearTimeout(this.timer);
          throttledKeyDown = undefined;
        }
      }
    );
    this.listenerKeyDown = DeviceEventEmitter.addListener(
      "onKeyDown",
      ({ keyCode = 0 }) => {
        const heldKeyCode = `${keyCode}_hold`;
        if (mappedProps && mappedProps[heldKeyCode]) {
          if (throttledKeyDown && throttledKeyDown.keyCode === keyCode) {
            throttledKeyDown.action();
          } else {
            throttledKeyDown = {
              keyCode,
              action: mappedProps[heldKeyCode].action
            };
          }
        }
      }
    );
  };

  _disableEventHandler = () => {
    if (this.listenerKeyUp) {
      this.listenerKeyUp.remove();
      delete this.listenerKeyUp;
    }
    if (this.listenerKeyDown) {
      this.listenerKeyDown.remove();
      delete this.listenerKeyDown;
    }
  };

  componentDidMount() {
    this._enableEventHandler();
  }

  componentWillUnmount() {
    this._disableEventHandler();
  }
}

FirestickKeys.defaultProps = {
  keyPressTimeOut: 50
};
