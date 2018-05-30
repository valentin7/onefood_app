// @flow
import * as _ from "lodash";
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";

import variables from "../../native-base-theme/variables/commonColor";

interface FieldProps {
    label: string,
    defaultValue?: string,
    children?: React.Node,
    last?: boolean,
    textInputRef?: TextInput => void
}

@observer
export default class Field extends React.Component<FieldProps> {

    input: TextInput;

    @observable value: string;

    componentWillMount() {
        this.setValue(this.props.defaultValue || "");
    }

    @autobind @action
    setValue(value: string) {
        this.value = value;
    }

    render(): React.Node {
        const {label, last, textInputRef} = this.props;

        const {value} = this;
        const keysToFilter = ["right", "defaultValue", "inverse", "label", "last"];
        const props = _.pickBy(this.props, (value, key) => keysToFilter.indexOf(key) === -1);
        return <View style={[style.row, last ? { borderBottomWidth: 0 }: {}]}>
            <TouchableOpacity
                onPress={() => this.refs.textInput.focus()}
                style={style.labelContainer}
            >
                <Text style={style.label}>{label.toUpperCase()}</Text>
            </TouchableOpacity>
            {
                React.Children.count(this.props.children) > 0
                ?
                    this.props.children
                :
                    <TextInput
                        onChangeText={this.setValue} {...{ value }} {...props}
                        style={style.input}
                        placeholderTextColor={variables.gray}
                        ref="textInput"
                        underlineColorAndroid="transparent"
                    />
            }
        </View>;
    }
}

const style = StyleSheet.create({
    row: {
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        flexDirection: "row",
        alignItems: "center",
        height: 60
    },
    labelContainer: {
        backgroundColor: "transparent"
    },
    label: {
        marginHorizontal: variables.contentPadding * 2,
        color: variables.mediumGray,
        fontSize: 14,
    },
    input: {
        flex: 1,
        color: variables.darkGray,
        fontSize: 14,
    }
});
