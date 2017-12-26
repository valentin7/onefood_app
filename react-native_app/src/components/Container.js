// @flow
import * as React from "react";
import {View, StyleSheet, SafeAreaView} from "react-native";

import type {BaseProps} from "./Types";

type ContainerProps = BaseProps & {
    safe?: boolean,
    children: React.Node
};

export default class Container extends React.Component<ContainerProps> {
    render(): React.Node {
        const {children, style, safe} = this.props;
        const containerStyle = [style, styles.base];
        if (safe) {
            return (
                <SafeAreaView style={containerStyle}>
                {children}
                </SafeAreaView>
            );
        } else {
            return (
                <View style={containerStyle}>
                {children}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    base: {
        flex: 1
    }
});
