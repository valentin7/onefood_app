import { Platform, Dimensions } from 'react-native';
import _ from 'lodash';
import {Constants} from "expo";

import variable from './../variables/platform';

const deviceHeight = Dimensions.get('window').height;
export default (variables = variable) => {
  const theme = {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  };

  return theme;
};
