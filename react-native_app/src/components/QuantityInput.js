// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {action, observable} from "mobx";
import {observer} from "mobx-react/native";

import Button from "./Button";
import Text from "./Text";
import {withTheme, StyleGuide} from "./theme";

import type {ThemeProps} from "./theme";
import * as Constants from '../Constants';

import variables from "../../native-base-theme/variables/commonColor";

type QuantityInputProps = ThemeProps & {
    singular: string,
    plural: string,
    from: number,
    to: number,
};

@observer
class QuantityInput extends React.Component<QuantityInputProps> {

    @observable quantity: number = this.props.defaultQuantity;
    @observable incrementAmount: number = this.props.defaultIncrement;

    @autobind @action increment() {
      this.quantity += this.incrementAmount;
      this.props.totalPriceChange(this.incrementAmount * Constants.PRECIO_BOTELLA);
    //  this.props.totalPrice += this.quantity * 20;
    }

    @autobind @action decrement() {
      this.quantity -= this.incrementAmount;
      this.props.totalPriceChange(- this.incrementAmount * Constants.PRECIO_BOTELLA);
    }

    render(): React.Node {
        const {singular, plural, from, to, theme} = this.props;
        return (
            <View style={[styles.container, { backgroundColor: variables.lighterGray,  borderColor: variables.darkGray, borderWidth: 0}]}>
                <Button
                    icon="minus"
                    iconStyle={{color: 'white'}}
                    secondary
                    style={styles.leftButton}
                    disabled={this.quantity === from}
                    onPress={this.decrement}
                />
                <Text primary>{`${this.quantity} ${this.quantity != 1 ? plural : singular}`}</Text>
                <Button
                    icon="plus"
                    iconStyle={{color: 'white'}}
                    secondary
                    style={styles.rightButton}
                    disabled={this.quantity === to}
                    onPress={this.increment}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: StyleGuide.spacing.small,
        marginBottom: StyleGuide.spacing.small,
        ...StyleGuide.styles.borderRadius
    },
    leftButton: {
        marginBottom: 0,
        marginRight: 5,
        borderColor: variables.darkGray,
        borderWidth: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: variables.brandPrimary,
    },
    rightButton: {
        marginBottom: 0,
        marginLeft: 5,
        borderColor: variables.darkGray,
        borderWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: variables.brandPrimary,
    }
});

export default QuantityInput;
