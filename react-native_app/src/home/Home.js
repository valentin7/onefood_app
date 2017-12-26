// @flow
import moment from "moment";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {H3} from "native-base";

import {BaseContainer, Task, TaskOverview, WindowDimensions} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Home extends React.Component<ScreenProps<>> {

    go(key: string) {
        this.props.navigation.navigate(key);
    }

    render(): React.Node {
        const today = moment();
        const date = today.format("MMMM D");
        const dayOfWeek = today.format("dddd").toUpperCase();
        const {navigation} = this.props;
        return <BaseContainer title={dayOfWeek} {...{ navigation }} scrollable>
            <View>
                <View style={style.date}>
                    <H3 style={{ textAlign: "center" }}>{date}</H3>
                </View>
                <TaskOverview completed={36} overdue={4} />
            </View>
            <Task
                date="2015-05-08 08:30"
                title="New Icons"
                subtitle="Mobile App"
                completed={true}
            />
            <Task
                date="2015-05-08 10:00"
                title="Coffee Break"
                completed={false}
            />
            <Task
                date="2015-05-08 14:00"
                title="Design Stand Up"
                subtitle="Hangouts"
                collaborators={[1, 2, 3]}
                completed={false}
            />
        </BaseContainer>;
    }
}

const style = StyleSheet.create({
    img: {
        ...WindowDimensions
    },
    date: {
        padding: variables.contentPadding * 2,
    }
});
