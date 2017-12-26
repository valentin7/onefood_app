// @flow
import * as React from "react";
import {View, StyleSheet} from "react-native";
import {LinearGradient} from "expo";

export default class Mark extends React.Component<{}> {

    render(): React.Node {
        return (
            <View style={styles.container}>
                <View style={styles.checkmark}>
                    <LinearGradient
                        colors={["rgba(0, 0, 0, 0.5)", "rgba(255, 255, 255, 0)"]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.leftPart}
                    />
                    <View style={styles.rightPart} />
                </View>
            </View>
        );
    }
}

const width = 19;
const height = 60;
const styles = StyleSheet.create({
    container: {
        height: 230,
        width: 230,
        justifyContent: "center",
        alignItems: "center"
    },
    checkmark: {
        transform: [
            { translateY: -width / Math.sqrt(2) * 0.5 },
            { translateX: -width / Math.sqrt(2) * 0.5 },
            { rotate: "-135deg" }
        ]
    },
    leftPart: {
        backgroundColor: "white",
        borderRadius: 3,
        width: height,
        height: width,
        transform: [{ translateY: width }]
    },
    rightPart: {
        backgroundColor: "white",
        borderRadius: 3,
        width: width,
        height: height * 1.59,
        transform: [],
        borderTopRightRadius: 0
    }
});
