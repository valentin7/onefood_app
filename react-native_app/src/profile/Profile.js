// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions} from "react-native";
import {H1, Text} from "native-base";

import {BaseContainer, TaskOverview, Images} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Profile extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Paul Jensen" navigation={this.props.navigation} scrollable>
            <Image source={Images.profile} style={style.img} />
            <View style={style.row}>
                <H1>{today.format("MMMM")}</H1>
                <Text style={{ textAlign: "center" }}>Good job! 9% more completed tasks this month.</Text>
            </View>
            <TaskOverview completed={49} overdue={8} />
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
