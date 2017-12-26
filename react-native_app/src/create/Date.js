// @flow
import moment from "moment";
import * as React from "react";
import {StyleSheet, View, Text} from "react-native";

import variables from "../../native-base-theme/variables/commonColor";

export default class Date extends React.Component<{}> {

    render(): React.Node {
        const now = moment();
        return <View>
            <View style={style.dateContainer}>
                <View style={style.date}>
                    <Text style={style.dayOfMonth}>{now.format("D")}</Text>
                    <View>
                        <Text style={style.dayOfWeek}>{now.format("dddd")}</Text>
                        <Text style={style.month}>{now.format("MMMM YYYY").toUpperCase()}</Text>
                    </View>
                </View>
            </View>
            <View style={style.row}>
                <View style={[style.cell, style.leftCell]}>
                    <Text style={style.text}>2 PM</Text>
                </View>
                <View style={style.cell}>
                    <Text style={style.text}>--</Text>
                </View>
            </View>
        </View>;
    }
}

const style = StyleSheet.create({
    dateContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        padding: variables.contentPadding * 2
    },
    date: {
        flexDirection: "row",
        alignItems: "center"
    },
    dayOfMonth: {
        fontSize: variables.fontSizeBase * 2 + variables.contentPadding,
        color: "white",
        marginRight: variables.contentPadding
    },
    dayOfWeek: {
        color: "white"
    },
    month: {
        color: variables.listBorderColor
    },
    row: {
        flex: 1,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        flexDirection: "row"
    },
    cell: {
        flex: .5,
        padding: variables.contentPadding * 2,
        justifyContent: "center",
        alignItems: "center"
    },
    leftCell: {
        borderRightWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    text: {
        color: "white"
    }
});
