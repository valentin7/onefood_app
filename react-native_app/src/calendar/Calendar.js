// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {ScrollView} from "react-native";
import {Icon, Picker} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";

import Month, {Date} from "./Month";

import {BaseContainer, Task} from "../components";
import type {ScreenProps} from "../components/Types";

const now = moment();

@observer
export default class Calendar extends React.Component<ScreenProps<>> {

    @observable selectedMonth: number;
    @observable selectedDate: Date;

    constructor() {
        super();
        const month = now.month();
        const day = now.date();
        this.selectedMonth = month;
        this.selectedDate = { month, day };
    }

    @autobind @action
    onChangeMonth (month: number) {
        this.selectedMonth = month;
    }

    @autobind @action
    onChangeDate (date: Date) {
        this.selectedDate = date;
    }

    render(): React.Node {
        const {navigation} = this.props;
        const title = "ONEFOOD";
        return <BaseContainer {...{ navigation, title }}>
                <ScrollView>
                    <Task
                        date="2015-05-08 10:00"
                        title="Comprar"
                        completed={false}
                    />
                </ScrollView>
                <Month month={this.selectedMonth} date={this.selectedDate} onPress={this.onChangeDate} />

        </BaseContainer>;
    }
}
