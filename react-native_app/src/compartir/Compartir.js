// @flow
import moment from "moment";
import * as React from "react";
import autobind from "autobind-decorator";
import {View, Image, StyleSheet, Dimensions, Alert} from "react-native";
import {H1, Text, Form, Item, Button, Input} from "native-base";

import {BaseContainer, TaskOverview, Images, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";
import Autolink from "react-native-autolink";

export default class Compartir extends React.Component<ScreenProps<>> {

    state = {
      codigo: ""
    }

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Compartir" navigation={this.props.navigation} scrollable>
            <View style={style.row}>
              <Text style={{fontWeight: "bold"}}>ONEFOOD-12343</Text>
            </View>
            <View style={style.row}>
              <Text>Comparte tu código personal y te daremos un OneFood gratis a ti y a la otra persona con la que lo compartiste.</Text>
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
