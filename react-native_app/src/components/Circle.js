// @flow
import * as React from "react";
import {View} from "react-native";

import type {BaseProps, ChildrenProps} from "./Types";

type CircleProps = BaseProps & ChildrenProps & {
    size: number,
    color: string
};

export default class Circle extends React.Component<CircleProps> {
    render(): React.Node {
        const {size, color, style} = this.props;
        const circleStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center"
        };
        return <View style={[circleStyle, style]}>{this.props.children}</View>;
    }
}
