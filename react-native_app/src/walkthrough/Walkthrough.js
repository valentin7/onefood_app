// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Image, SafeAreaView, Dimensions} from "react-native";
import {Button, Footer, FooterTab, Text, Icon} from "native-base";
import Swiper from "react-native-swiper";

import {Styles, NavigationHelpers, Images, WindowDimensions} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";


export default class Walkthrough extends React.Component<ScreenProps<>> {

    swiper: Swiper;

    state = {
      onLastPage: false,
      pageCount: 0,
    }


    @autobind
    home() {
        NavigationHelpers.reset(this.props.navigation, "Main");
    }

    @autobind
    siguientePressed() {
      //this.setState({pageCount: this.state.pageCount + 1});
      //this.swiper.scrollBy(1);
    }

    @autobind
    indexChange(index) {
      console.log('hereee ', index);
      this.setState({pageCount: index});
      //this.setState({onLastPage: index == 2});
      //this.swiper.scrollBy(1);
    }

    render(): React.Node {
        return <SafeAreaView style={{ flex: 1 }}>
              <Swiper loop={false} showsButtons={true} nextButton={<Text style={{color: variables.brandPrimary, fontSize: 58}}>›</Text>} prevButton={<Text style={{color: variables.brandPrimary, fontSize: 58}}>‹</Text>} activeDotColor={variables.brandPrimary}>
                <Image source={Images.walkthrough1} style={style.infoImg} />
                <Image source={Images.walkthrough2} style={style.infoImg} />
                <Image source={Images.walkthrough3} style={style.infoImg} />
                <Image source={Images.walkthrough4} style={style.infoImg} />
                <View style={[Styles.center, Styles.flexGrow]}>
                    <Image source={Images.walkthrough5} style={style.infoImg2} />
                    <Footer style={{position: 'absolute', bottom: 42, borderTopWidth: variables.borderWidth, borderBottomWidth: variables.borderWidth }}>
                      <FooterTab>
                        <Button onPress={this.home} primary style={style.listoButton}>
                          <Text>LISTO</Text>
                        </Button>
                      </FooterTab>
                    </Footer>
                </View>
            </Swiper>
        </SafeAreaView>;
    }
}

class Phone extends React.Component<{}> {
    render(): React.Node {
        return <View style={style.phone}>
            <View style={style.phoneContainer}>
                <Icon name="ios-checkmark-circle-outline" style={{ fontSize: 45 }} />
            </View>
            <View style={style.phoneFooter}>
                <Icon name="ios-radio-button-off" style={{ fontSize: 15 }} />
            </View>
        </View>;
    }
}

const {height} = WindowDimensions;
const {width, windowHeight} = Dimensions.get("window");
const borderWidth = variables.borderWidth * 2;
const swiperHeight = height;
const style = StyleSheet.create({
    img: {
        position: 'absolute',
        top: -50,
        ...WindowDimensions,
        resizeMode: 'contain',
    },
    infoImg: {
      flex: 1,
      width: width - 64,
      left: 32,
      justifyContent: 'center',
      height: windowHeight - 60,
      resizeMode: 'contain',
      top: -20,
    },
    infoImg2: {
      flex: 1,
      width: width - 64,
      left: 0,
      justifyContent: 'center',
      height: windowHeight - 60,
      resizeMode: 'contain',
      top: -20,
    },
    next: {
        borderRadius: 0,
        borderLeftWidth: variables.borderWidth,
        borderColor: "white"
    },
    listoButton : {
      borderRadius: 5,
      width: width - 30
    },
    phone: {
        borderColor: "white",
        borderWidth: borderWidth,
        borderRadius: 4,
        height: 175,
        width: 100,
        marginBottom: variables.contentPadding
    },
    phoneContainer: {
        flex: .8,
        justifyContent: "center",
        alignItems: "center"
    },
    phoneFooter: {
        flex: .2,
        borderColor: "white",
        borderTopWidth: borderWidth,
        justifyContent: "center",
        alignItems: "center"
    }
})
