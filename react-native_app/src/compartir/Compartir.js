// @flow
import moment from "moment";
import * as React from "react";
import autobind from "autobind-decorator";
import {View, Image, StyleSheet, Dimensions, Alert, TouchableOpacity, ActionSheetIOS} from "react-native";
import {H1, Text, Form, Item, Button, Input, Icon} from "native-base";

import {BaseContainer, TaskOverview, Images, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";
import Autolink from "react-native-autolink";

export default class Compartir extends React.Component<ScreenProps<>> {

    state = {
      codigo: ""
    }

    @autobind
    shareCode() {
      console.log("SHARING CODEE");
      ActionSheetIOS.showShareActionSheetWithOptions({message: "ONE-33452"}, (failure) => {
        console.log("failure ", failure);
      }, (success) => {
        console.log("success ", success);
      });
    }

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Compartir" navigation={this.props.navigation} scrollable>
            <View style={style.row}>
              <Text>Comparte tu código personal y te daremos un OneFood gratis a ti y a la otra persona con la que lo compartiste.</Text>
            </View>
            <TouchableOpacity style={style.row} onPress={this.shareCode}>
              <Text style={{fontWeight: "bold", color: variables.brandPrimary}} selectable={true}>ONE33452</Text>
              <Icon name="ios-share-alt" style={style.icon} />
            </TouchableOpacity>

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
    },
    icon: {
      color: variables.brandPrimary,
    }

});
