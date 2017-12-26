import { Platform } from 'react-native';
import _ from 'lodash';

import variable from './../variables/platform';


export default (variables = variable) => {
  const checkBoxTheme = {
      '.checked': {
        'NativeBase.Icon': {
          color: "transparent",
        },
        'NativeBase.IconNB': {
          color: "transparent",
        },
          backgroundColor: "white"
      },
      'NativeBase.Icon': {
        color: 'transparent',
        lineHeight: variables.CheckboxIconSize,
        marginTop: variables.CheckboxIconMarginTop,
        fontSize: variables.CheckboxFontSize,
      },
      'NativeBase.IconNB': {
        color: 'transparent',
        lineHeight: variables.CheckboxIconSize,
        marginTop: variables.CheckboxIconMarginTop,
        fontSize: variables.CheckboxFontSize,
      },
      borderRadius: variables.CheckboxRadius,
      backgroundColor: "rgba(255, 255, 255, .5)",
      overflow: 'hidden',
      width: variables.checkboxSize,
      height: variables.checkboxSize,
      borderWidth: 0,
      paddingLeft: variables.CheckboxPaddingLeft - 1,
      paddingBottom: variables.CheckboxPaddingBottom,
      left: 10,
  };


  return checkBoxTheme;
};
