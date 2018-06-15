// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, Alert} from "react-native";
import {H1, Text, Input, Item, Content, Button} from "native-base";

import {BaseContainer, TaskOverview, Images, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";
import Autolink from "react-native-autolink";
import autobind from "autobind-decorator";
import { observer, inject } from "mobx-react/native";

@inject('store') @observer
export default class InfoRep extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Info Rep" navigation={this.props.navigation} scrollable>
            <View style={style.row}>
              <Text style={style.paragraph}>
              Ser un ONEFOOD Rep es ...
              </Text>
              <Text style={style.paragraph}>
              Más Información práctica.
              </Text>
            </View>
        </BaseContainer>;
    }
}

/*
<Text style={style.paragraph}>
ONEFOOD es una comida liquida tecnológica, desarrollada por ingenieros químicos en alimento, investigadores y nutriólogos para suplir una comida completa de manera práctica, fácil y nutrimentalmente mejor que una comida promedio.
</Text>
*/

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750,
        resizeMode: "cover"
    },
    paragraph: {
      marginBottom: 12,
    },
    row: {
        justifyContent: "center",
        alignItems: "center",
        padding: variables.contentPadding * 2
    },
    link: {
      fontSize: 20,
      color: variables.brandPrimary
    }

});
