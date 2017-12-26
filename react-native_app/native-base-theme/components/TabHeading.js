import { Platform } from 'react-native';
import _ from 'lodash';

import variable from './../variables/platform';

export default (variables = variable) => {
  const platformStyle = variables.platformStyle;
  const platform = variables.platform;

  const tabHeadingTheme = {
    flexDirection: 'row',
    backgroundColor: variables.tabDefaultBg,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    '.scrollable': {
      paddingHorizontal: 20,
      flex: 1,
      minWidth: 60,
    },
    'NativeBase.Text': {
      color: variables.topTabBarTextColor,
      marginHorizontal: 7
    },
    'NativeBase.Icon': {
      color: variables.topTabBarTextColor,
      fontSize: 26
    },
    '.active': {
      'NativeBase.Text': {
        color: variables.topTabBarActiveTextColor,
        fontWeight: '600'
      },
      'NativeBase.Icon': {
        color: variables.topTabBarActiveTextColor
      },
    }
  };


  return tabHeadingTheme;
};
