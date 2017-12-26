// @flow
import moment from "moment";
import * as React from "react";
import {StyleSheet, View, Text, ScrollView} from "react-native";
import {Tab, Tabs, TabHeading, H1} from "native-base";

import {BaseContainer, Task, Styles, TaskOverview} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

const DAY = 1;
const WEEK = 2;
const MONTH = 3;

export default class Overview extends React.Component<ScreenProps<>> {

    render(): React.Node {
        return <BaseContainer title="Overview" navigation={this.props.navigation}>
            <Tabs>
                <Tab heading={<TabHeading><Text style={style.tabHeading}>DAY</Text></TabHeading>}>
                    <OverviewTab period={DAY} />
                </Tab>
                <Tab heading={<TabHeading><Text style={style.tabHeading}>WEEK</Text></TabHeading>}>
                    <OverviewTab period={WEEK} />
                </Tab>
                <Tab heading={<TabHeading><Text style={style.tabHeading}>MONTH</Text></TabHeading>}>
                    <OverviewTab period={MONTH} />
                </Tab>
            </Tabs>
        </BaseContainer>;
    }
}

type OverviewTabProps = {
    period: 1 | 2 | 3
};

class OverviewTab extends React.Component<OverviewTabProps> {

    render(): React.Node {
        const {period} = this.props;
        let label;
        if (period === 1) {
            label = moment().format("dddd");
        } else if (period === 2) {
            label = `Week ${moment().format("W")}`;
        } else {
            label = moment().format("MMMM");
        }
        return <View style={style.container}>
            <ScrollView>
                <View style={[style.tab, Styles.center]}>
                    <H1>{label}</H1>
                </View>
                <TaskOverview completed={64} overdue={5} />
                <Task date="2015-05-08 09:30" title="New Icons" subtitle="Mobile App" completed={true} />
                <Task
                    date="2015-05-08 11:00"
                    title="Design Stand Up"
                    subtitle="Hangouts"
                    collaborators={[1, 2, 3]}
                    completed={false}
                    />
                <Task date="2015-05-08 14:00" title="New Icons" subtitle="Home App" completed={true} />
                <Task date="2015-05-08 16:00" title="Revise Wireframes" subtitle="Company Website" completed={true} />
            </ScrollView>
        </View>
    }
}

const style = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    tabHeading: {
        color: "white"
    },
    tab: {
        padding: variables.contentPadding * 4
    }
});
