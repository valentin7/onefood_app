// @flow
import moment from "moment";
import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import {H3} from "native-base";

import {Avatar, Styles} from "../components";

import variables from "../../native-base-theme/variables/commonColor";
// import Circle from "../components/Circle";

type PedidoProps = {
    numero: string,
    title: string,
    subtitle?: string,
};

export default class PedidoItem extends React.Component<PedidoProps> {

    static defaultProps = {
        collaborators: []
    }

    render(): React.Node {
        const {numero, title, subtitle} = this.props;
        return <View style={[Styles.listItem, { height: 100 }]}>

            <View style={[style.title]}>
                <H3>{title}</H3>
            </View>
            <View style={[style.time]}>
                <Text style={style.titleText}>{numero}</Text>
            </View>
        </View>;
    }
}

const style = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    time: {
        alignItems: "center",
        flexDirection: "row",
        padding: variables.contentPadding
    },
    title: {
        justifyContent: "center",
        flex: 1,
        padding: variables.contentPadding
    },
    titleText: {
        fontSize: variables.fontSizeBase * 2 + variables.contentPadding,
        color: "white"
    },
});
