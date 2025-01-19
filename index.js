/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App/bridgeNavigator';
import {name as appName} from './app.json';
import { StatusBar } from 'react-native';

StatusBar.setHidden(true, 'slide');
AppRegistry.registerComponent(appName, () => App);
