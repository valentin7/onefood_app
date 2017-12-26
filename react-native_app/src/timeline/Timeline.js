// @flow
import moment from "moment";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {H1, Icon, Text} from "native-base";

import {BaseContainer, Styles, Task} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Timeline extends React.Component<ScreenProps<>> {

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Timeline" navigation={this.props.navigation} scrollable>
            <View style={[Styles.center, style.heading]}>
                <H1>{today.format("MMMM")}</H1>
                <View style={Styles.row}>
                    <Icon name="ios-time-outline" style={{ marginRight: variables.contentPadding }} />
                    <Text>{today.format("dddd, MMMM D")}</Text>
                </View>
            </View>
            <Task date="2015-05-08 09:30" title="New Icons" subtitle="Mobile App" completed timeline />
            <Task
                date="2015-05-08 11:00"
                title="Design Stand Up"
                subtitle="Hangouts"
                collaborators={[1, 2, 3]}
                timeline
            />
            <Task date="2015-05-08 14:00" title="New Icons" subtitle="Home App" completed timeline />
            <Task date="2015-05-08 16:00" title="Revise Wireframes" subtitle="Company Website" completed timeline />
        </BaseContainer>;
    }
}

const style = StyleSheet.create({
    heading: {
        marginTop: variables.contentPadding * 2
    }
});
