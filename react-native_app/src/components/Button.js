// @flow
import * as React from "react";
import {StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, View} from "react-native";

import Icon from "./Icon";
import Text from "./Text";
import {withTheme, StyleGuide} from "./theme";

import type {IconName} from "./Model";
import type {ThemeProps, StyleProps} from "./theme";
import variables from "../../native-base-theme/variables/commonColor";

type ButtonProps = ThemeProps & StyleProps & {
    onPress: () => mixed,
    primary?: boolean,
    secondary?: boolean,
    label?: string,
    icon?: IconName,
    disabled?: boolean,
    primaryTextColor?: boolean
};

class Button extends React.PureComponent<ButtonProps> {

    render(): React.Node {
        const {
            onPress, style, label, icon, iconStyle, primary, secondary, theme, primaryTextColor, disabled
        } = this.props;
        const opacity = disabled ? 0.5 : 1;
        let color: string;
        let backgroundColor: string;
        if (primary) {
            backgroundColor = "green";
        } else if (secondary) {
            backgroundColor = "blue";
        } else {
            backgroundColor = "transparent";
        }
        if (primary) {
            color = "white";
        } else if (secondary) {
            color = "white";
        } else if (primaryTextColor) {
            color = "black";
        } else {
            color = "gray";
        }
        //color = variables.brandPrimary;
        const shadow = primary ? StyleGuide.styles.shadow : {};
        let Btn: React.ComponentType<*>;
        if (disabled) {
            Btn = View;
        } else if (Platform.OS === "ios") {
            Btn = TouchableOpacity;
        } else {
            Btn = TouchableNativeFeedback;
        }
        return (
            <Btn {...{onPress}}>
                <View style={[styles.button, { backgroundColor, opacity, ...shadow }, style]} >
                    {icon && <Icon name={icon} {...{color}} />}
                    {label && <Text type="headline" {...{color}}>{label}</Text>}
                </View>
            </Btn>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        ...StyleGuide.styles.button
    },
    icon: {
        ...StyleGuide.styles.buttonIcon
    }
});

export default Button;
