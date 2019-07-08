/**
 * @format
 */

import { AppRegistry } from "react-native";
import { App } from "./src";
import { name as appName } from "./app.json";
import { URL, URLSearchParams } from 'whatwg-url';
import { Buffer } from 'buffer';

AppRegistry.registerComponent(appName, () => App);
global.Buffer = Buffer;
global.URL = URL;
global.URLSearchParams = URLSearchParams;