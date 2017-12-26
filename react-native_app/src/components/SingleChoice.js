// @flow
import * as React from "react";
import {observable, runInAction} from "mobx";
import {observer} from "mobx-react/native";
import {View} from "react-native";
import {Button, Text, CheckBox as RNCheckBox} from "native-base";

import Styles from "./Styles";

type SingleChoiceProps = {
    labels: string[]
};

@observer
export default class SingleChoice extends React.Component<SingleChoiceProps> {

    @observable index: number

    render(): React.Node {
        const {labels} = this.props;
        return <View style={Styles.row}>
            {
                labels.map((label, index) => (<CheckBox
                    key={index}
                    label={label}
                    checked={index === this.index}
                    onPress={() => runInAction(() => this.index = index)}
                />))
            }
        </View>;
    }
}

type CheckBoxProps = {
    label: string,
    checked: boolean,
    onPress: () => void
};

class CheckBox extends React.Component<CheckBoxProps> {
    render(): React.Node  {
        const {label, checked, onPress} = this.props;
        return <Button {...{ onPress }} disabled={checked} transparent>
            <RNCheckBox {...{ checked, onPress }} style={{ margin: 15 }} />
            <Text style={{ color: checked ? "white" : "rgba(255, 255, 255, .5)"}}>{label}</Text>
        </Button>;
    }
}
