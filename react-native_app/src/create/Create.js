// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {BaseContainer, Avatar, Field, Styles} from "../components";
import type {ScreenProps} from "../components/Types";

import Date from "./Date";

import variables from "../../native-base-theme/variables/commonColor";

export default class Create extends React.Component<ScreenProps<>> {

    render(): React.Node {
        return <BaseContainer title="Add New" navigation={this.props.navigation} scrollable>
            <Date />
            <View style={Styles.form}>
                <Field label="Title" defaultValue="Weekly Stand Up" />
                <Field label="Where" defaultValue="Hangout" />
                <Field label="Notify" defaultValue="20 minutes before" />
                <Field label="People">
                    <View style={style.avatars}>
                        <Avatar id={2} size={30} style={style.avatar} />
                        <Avatar id={3} size={30} style={style.avatar} />
                    </View>
                </Field>
                <Field label="Repeat" defaultValue="No" />
            </View>
        </BaseContainer>;
    }
}

const style = StyleSheet.create({
    avatars: {
        flexDirection: "row"
    },
    avatar: {
        marginRight: variables.contentPadding
    }
});
