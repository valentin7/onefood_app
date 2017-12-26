// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions} from "react-native";
import {H1, Text} from "native-base";

import {BaseContainer, TaskOverview, Images, Styles} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Profile extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Comprar" navigation={this.props.navigation} scrollable>
            <Image source={Images.music} style={style.img} />
            <View style={style.row}>
                <H1>ONEFOOD</H1>
                <Text style={{ textAlign: "center" }}>Una comida completa.</Text>
            </View>
            <View style={[Styles.center, Styles.flexGrow]}>
              <Text>$50 pesos</Text>
            </View>
            <View style={[Styles.center, Styles.flexGrow]}>
              <Text>Cuantos</Text>
            </View>
            <View style={[Styles.center, Styles.flexGrow]}>
              <Text>Compra única o compra periódica</Text>
            </View>
        </BaseContainer>;
    }
}

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750,
        resizeMode: "cover"
    },
    row: {
        justifyContent: "center",
        alignItems: "center",
        padding: variables.contentPadding * 2
    }
});
