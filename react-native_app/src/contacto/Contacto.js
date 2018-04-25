// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions} from "react-native";
import {H1, Text, Icon} from "native-base";

import {BaseContainer, TaskOverview, Images} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";
import Autolink from "react-native-autolink";

export default class Contacto extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const today = moment();
        var correo = "  Correo: ";
        var tel1 = "  Tel corporativo: ";
        var tel2 = "  Tel ONEFOOD live: ";
        var tel3 = "  Tel distribución: ";
        return <BaseContainer title="Contacto" navigation={this.props.navigation} scrollable>
            <View style={style.row}>
              <Text><Icon name="ios-mail" style={style.icon} />
                {correo} <Autolink linkStyle={style.link} text="hola@onefood.com" email={true}/></Text>
            </View>
            <View style={style.row}>
              <Text><Icon name="ios-call" style={style.icon} />
                {tel1}<Autolink linkStyle={style.link} text="(55) 489 27 369" phone={true} /></Text>
              <Text><Icon name="ios-call" style={style.icon} />
                 {tel2}<Autolink linkStyle={style.link} text="(55) 473 89 302" phone={true} /></Text>
              <Text><Icon name="ios-call" style={style.icon} />
                {tel3}<Autolink linkStyle={style.link} text="(55) 765 43 269" phone={true} /></Text>
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
        padding: variables.contentPadding * 2
    },
    link: {
      color: variables.darkGray
    },
    icon: {
      color: variables.brandPrimary,
      marginRight: 5,
    }

});
