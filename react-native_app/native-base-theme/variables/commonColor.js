// @flow
import color from 'color';

import { Platform, Dimensions, PixelRatio } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;

const white = "white";
const black = "rgb(29, 29, 38)";
const gray =  "rgba(255, 255, 255, .5)";
const lightGray = "#f8f8f8";

export default {
  platformStyle,
  platform,
    // AndroidRipple
  androidRipple: true,
  androidRippleColor: 'rgba(255, 255, 255, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',

    // Badge
  badgeBg: '#ED1727',
  badgeColor: '#fff',
    // New Variable
  badgePadding: 3,

    // Button
  btnFontFamily: "Avenir-Book",
  btnDisabledBg: '#b5b5b5',
  btnDisabledClr: '#f1f1f1',

    // CheckBox
  CheckboxRadius: 13,
  CheckboxBorderWidth: 1,
  CheckboxPaddingLeft: 4,
  CheckboxPaddingBottom: 0,
  CheckboxIconSize: 21,
  CheckboxIconMarginTop: undefined,
  CheckboxFontSize: (23 / 0.9),
  DefaultFontSize: 17,
  checkboxBgColor: '#039BE5',
  checkboxSize: 20,
  checkboxTickColor: 'transparent',

  // Segment
  segmentBackgroundColor: '#3F51B5',
  segmentActiveBackgroundColor: '#fff',
  segmentTextColor: '#fff',
  segmentActiveTextColor: '#3F51B5',
  segmentBorderColor: '#fff',
  segmentBorderColorMain: '#3F51B5',

    // New Variable
  get defaultTextColor() {
    return this.textColor;
  },


  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return this.fontSizeBase * 1.1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },

  buttonPadding: 0,

  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },


    // Card
  cardDefaultBg: '#fff',


      // Color
  brandPrimary: 'rgba(227, 81, 188, .75)',
  brandInfo: '#00BAFF',
  brandSecondary: '#D667CE',
  brandSuccess: '#5cb85c',
  brandDanger: '#d9534f',
  brandWarning: '#f0ad4e',
  brandSidebar: '#252932',
  white,
  black,
  gray,
  lightGray,

    // Font
  fontFamily: 'Avenir-Book',
  fontSizeBase: 15,

  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },


    // Footer
  footerHeight: 55,
  footerDefaultBg: "transparent",

    // FooterTab
  tabBarTextColor: 'white',
  tabBarTextSize: 14,
  activeTab: '#007aff',
  sTabBarActiveTextColor: '#007aff',
  tabBarActiveTextColor: '#fff',
  tabActiveBgColor: "transparent",

    // Tab
  tabDefaultBg: 'transparent',
  topTabBarTextColor: '#b3c7f9',
  topTabBarActiveTextColor: '#fff',
  topTabActiveBgColor: '#1569f4',
  topTabBarBorderColor: '#fff',
  get topTabBarActiveBorderColor() { return "white"; },


    // Header
  toolbarBtnColor: "white",
  toolbarDefaultBg: '#00BAFF',
  toolbarHeight: 64,
  toolbarIconSize: 20,
  toolbarSearchIconSize: 20,
  toolbarInputColor: '#CECDD2',
  searchBarHeight: 30,
  toolbarInverseBg: '#222',
  toolbarTextColor: "white",
  iosStatusbar: 'light-content',
  toolbarDefaultBorder: '#2874F0',
  get statusBarColor() {
    return color(this.toolbarDefaultBg).darken(0.2).hex();
  },


    // Icon
  iconFamily: 'Ionicons',
  iconFontSize: 30,
  iconMargin: 7,
  iconHeaderSize: 33,


    // InputGroup
  inputFontSize: 17,
  inputBorderColor: '#D9D5DC',
  inputSuccessBorderColor: '#2b8339',
  inputErrorBorderColor: '#ed2f2f',

  get inputColor() {
    return this.textColor;
  },
  inputColorPlaceholder: "white",

  inputGroupMarginBottom: 10,
  inputHeightBase: 50,
  inputPaddingLeft: 5,

  get inputPaddingLeftIcon() {
    return this.inputPaddingLeft * 8;
  },


    // Line Height
  btnLineHeight: 24,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  iconLineHeight: 37,
  lineHeight: 20,


    // List
  listBorderColor: 'rgba(255, 255, 255, .5)',
  listDividerBg: lightGray,
  listItemHeight: 45,
  listBtnUnderlayColor: '#DDD',

    // Card
  cardBorderColor: '#ccc',

    // Changed Variable
  listItemPadding: 10,

  listNoteColor: '#808080',
  listNoteSize: 13,


    // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',


    // Radio Button
  radioBtnSize: 25,
  radioSelectedColorAndroid: '#5067FF',

    // New Variable
  radioBtnLineHeight: 29,

  radioColor: '#7e7e7e',

  get radioSelectedColor() {
    return color(this.radioColor).darken(0.2).hex();
  },


    // Spinner
  defaultSpinnerColor: '#45D56E',
  inverseSpinnerColor: '#1A191B',


    // Tabs
  tabBgColor: '#F8F8F8',
  tabFontSize: 15,
  tabTextColor: '#222222',


    // Text
  textColor: "white",
  inverseTextColor: 'black',
  noteFontSize: 14,


    // Title
  titleFontfamily: "Avenir-Light",
  titleFontSize: 17,
  subTitleFontSize: 12,
  subtitleColor: '#FFF',

    // New Variable
  titleFontColor: "white",


    // Other
  borderRadiusBase: 0,
  borderWidth: (1/PixelRatio.getPixelSizeForLayoutSize(1)),
  contentPadding: 10,

  get darkenHeader() {
    return color(this.tabBgColor).darken(0.03).hex();
  },

  dropdownBg: '#000',
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  jumbotronBg: '#C9C9CE',
  jumbotronPadding: 30,
  deviceWidth,
  deviceHeight,

    // New Variable
  inputGroupRoundedBorderRadius: 30,
};
