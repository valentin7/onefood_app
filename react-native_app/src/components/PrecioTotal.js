// @flow
import * as React from "react";
import {StyleSheet, View, Text} from "react-native";
import {H1} from "native-base";

import Styles from "./Styles";

import variables from "../../native-base-theme/variables/commonColor";

type PrecioTotalProps = {
    cantidad: number,
    total: number
};

export default class PrecioTotal extends React.Component<PrecioTotal> {
    render(): React.Node {
        const {sabor, cantidad, total} = this.props;
        return <View style={style.container}>
        <View style={[style.count, Styles.center, style.leftCell]}>
            <H1 style={style.heading}>{`${cantidad}`}</H1>
            <Text style={Styles.grayText}>CANTIDAD</Text>
        </View>
            <View style={[style.count, Styles.center, style.leftCell]}>
                <H1 style={style.heading}>{`${sabor}`}</H1>
                <Text style={Styles.grayText}>SABOR</Text>
            </View>

        </View>;
    }
}

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderTopWidth: variables.borderWidth,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    leftCell: {
        borderRightWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    count: {
        flex: .5,
        padding: variables.contentPadding * 2
    },
    heading: {
        color: "white"
    }
});
