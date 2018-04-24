// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions} from "react-native";
import {H1, Text} from "native-base";

import {BaseContainer, TaskOverview, Images} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";
import Autolink from "react-native-autolink";

export default class Nosotros extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Nosotros" navigation={this.props.navigation} scrollable>
            <View style={style.row}>
              <Text style={style.paragraph}>
              ONEFOOD es la marca de comida inteligente que busca proveer soluciones alimenticias a aquellas personas que disfrutan vivir un estilo de vida movido, saludable y moderno.
              </Text>
              <Text style={style.paragraph}>
ONEFOOD es una comida liquida tecnológica, desarrollada por ingenieros químicos en alimento, investigadores y nutriólogos para suplir una comida completa de manera práctica, fácil y nutrimentalmente mejor que una comida promedio.
              </Text>
              <Text style={style.paragraph}>
              Orgullosamente Mexicanos comprometidos con la más alta calidad y tecnología para brindarle a nuestro cliente un producto Premium. En ONEFOOD la innovación es nuestro guía para continuar creando soluciones integrales.
              </Text>
              <Text style={style.paragraph}>
              ¡Bienvenido!
              </Text>
              <Text style={style.paragraph}>
              — Equipo ONEFOOD
              </Text>
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
    paragraph: {
      marginBottom: 12,
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
