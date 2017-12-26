// @flow
import * as React from "react";
import {Text} from "react-native";
import variables from "../../native-base-theme/variables/commonColor";

import type {BaseProps, ChildrenProps} from "./Types";

type SmallProps = BaseProps & ChildrenProps;

export default class Small extends React.Component<SmallProps> {
    render(): React.Node {
        return <Text style={[{ fontSize: 12, color: variables.white }, this.props.style]}>{this.props.children}</Text>;
    }
}
