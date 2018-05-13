// @flow
import color from 'color';

import { Platform, Dimensions, PixelRatio } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;

const white = "white";
const black = "rgb(29, 29, 38)";
const darkGray = "rgb(50, 50, 50)";
const gray =  "rgba(255, 255, 255, .5)";
const lightGray = "rgba(200, 200, 200, 1)";
const lighterGray = "rgba(240, 240, 240, 1)";
const mediumGray = "rgba(125, 125, 125, 1)";
const brandPrimary = '#7CBD31'; //'rgba(142, 188, 37, 1)';
const brandInfo = 'rgba(253, 253, 253, 1)';
const brandSecondary = 'rgba(0, 149, 53, 1)';
const brandSuccess = '#5cb85c';
const brandDanger = '#d9534f';
const brandWarning = '#f0ad4e';
const brandSidebar = '#252932';

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
  checkboxBgColor: lightGray,
  checkboxSize: 20,
  checkboxTickColor: 'transparent',


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

  // Segment
  segmentBackgroundColor: 'rgba(142, 188, 37, 1)',
  segmentActiveBackgroundColor: 'rgba(142, 188, 37, .1)',
  segmentTextColor: mediumGray,
  segmentActiveTextColor: 'rgba(142, 188, 37, 1)',
  segmentBorderColor: mediumGray,
  segmentBorderColorMain: 'rgba(142, 188, 37, 1)',

  // Color
  brandPrimary,
  brandInfo,
  brandSecondary,
  brandSuccess,
  brandDanger,
  brandWarning,
  brandSidebar,
  white,
  black,
  darkGray,
  gray,
  lightGray,
  lighterGray,

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
  toolbarBtnColor: brandPrimary,
  toolbarDefaultBg: "white",
  toolbarHeight: 64,
  toolbarIconSize: 20,
  toolbarSearchIconSize: 20,
  toolbarInputColor: '#CECDD2',
  searchBarHeight: 30,
  toolbarInverseBg: '#222',
  toolbarTextColor: "white",
  iosStatusbar: 'dark-content',
  //toolbarDefaultBorder: '#2874F0',
  get statusBarColor() {
    return color(this.toolbarDefaultBg).darken(0.2).hex();
  },


    // Icon
  iconFamily: 'Ionicons',
  iconFontSize: 30,
  iconMargin: 7,
  iconHeaderSize: 33,
  iconColor: 'black',



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
  listBorderColor: 'rgba(150, 150, 150, .5)',
  listDividerBg: lightGray,
  listItemHeight: 45,
  listBtnUnderlayColor: '#DDD',
  listSeparatorBg: 'rgba(200, 200, 200, .2)',
  listSeparatorOBg: 'rgba(240, 240, 240, 1)',


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
  radioSelectedColorAndroid: brandPrimary,

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
  textColor: darkGray,
  inverseTextColor: lightGray,
  noteFontSize: 14,


    // Title
  titleFontfamily: "Avenir-Light",
  titleFontSize: 17,
  subTitleFontSize: 12,
  subtitleColor: '#FFF',

    // New Variable
  titleFontColor: brandPrimary,//"white",


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
