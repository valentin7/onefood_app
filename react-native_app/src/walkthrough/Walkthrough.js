// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Image, SafeAreaView} from "react-native";
import {Button, Footer, FooterTab, Text, Icon} from "native-base";
import Swiper from "react-native-swiper";

import {Styles, NavigationHelpers, Images, WindowDimensions} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Walkthrough extends React.Component<ScreenProps<>> {

    swiper: Swiper;

    @autobind
    home() {
        NavigationHelpers.reset(this.props.navigation, "Main");
    }

    @autobind
    renderPagination(): React.Node {
        return (
            <View>
                <Footer style={{ borderTopWidth: variables.borderWidth, borderBottomWidth: variables.borderWidth }}>
                    <FooterTab>
                        <Button onPress={this.home}transparent>
                            <Text>LISTO</Text>
                        </Button>
                        <Button transparent onPress={() => this.swiper.scrollBy(1)} style={style.next}>
                            <Text>SIGUIENTE</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </View>
        );
    }

    render(): React.Node {
        const {renderPagination} = this;
        return <SafeAreaView style={{ flex: 1 }}>
            <Image source={Images.walkthrough} style={style.img} />
            <Swiper
                ref={swiper => this.swiper = swiper}
                height={swiperHeight}
                dot={<Icon name="ios-radio-button-off-outline" style={{ fontSize: 12, margin: 4 }} />}
                activeDot={<Icon name="ios-radio-button-on" style={{ fontSize: 12, margin: 4 }} />}
                {...{ renderPagination }}
            >
                <View style={[Styles.center, Styles.flexGrow]}>
                    <Phone />
                    <Text>ONEFOOD es una comida completa</Text>
                </View>
                <View style={[Styles.center, Styles.flexGrow]}>
                    <Phone />
                    <Text>Vive a tu ritmo.</Text>
                </View>
                <View style={[Styles.center, Styles.flexGrow]}>
                    <Phone />
                    <Text>Rico, rápido, y saludable.</Text>
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
const borderWidth = variables.borderWidth * 2;
const swiperHeight = height;
const style = StyleSheet.create({
    img: {
        ...WindowDimensions,
        ...StyleSheet.absoluteFillObject
    },
    next: {
        borderRadius: 0,
        borderLeftWidth: variables.borderWidth,
        borderColor: "white"
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
