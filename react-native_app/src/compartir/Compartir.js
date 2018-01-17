// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions} from "react-native";
import {H1, Text} from "native-base";

import {BaseContainer, TaskOverview, Images} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";
import Autolink from "react-native-autolink";

export default class Compartir extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Compartir" navigation={this.props.navigation} scrollable>
            <View style={style.row}>
              <Text>ONEFOOD-12343</Text>
            </View>
            <View style={style.row}>
            <Text>Comparte RICO tu código y te daremos un OneFood gratis a ti y a la otra persona con la que lo compartiste.</Text>
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
    },
    link: {
      fontSize: 20
    }

});
