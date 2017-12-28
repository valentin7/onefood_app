// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Text} from "react-native";
import {Button, Icon} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";

import {BaseContainer, Styles, JankWorkaround} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Pedidos extends React.Component<ScreenProps<>> {

    state = {
      loading: true,
    }

    componentDidMount() {
      JankWorkaround.runAfterInteractions(() => {
        this.setState({ loading: false });
      });
    }


    render(): React.Node {
        return <BaseContainer title="Pedidos" navigation={this.props.navigation} scrollable>
                <View>
                 {this.state.loading ? (
                   <Loading />
                 ) : (
                   <View>
                    <Item title="6 ONEFOODS" />
                    <Item title="24 ONEFOOD" done />
                    <Item title="3 ONEFOOD" done />
                    <Item title="1 ONEFOOD" done />
                    </View>
                  )}
              </View>
        </BaseContainer>;
    }
}

const Loading = () => (
  <View style={style.container}>
    <Text>Loading...</Text>
  </View>
);

type ItemProps = {
    title: string,
    done?: boolean
};

@observer
class Item extends React.Component<ItemProps> {
    @observable done: boolean;

    componentWillMount() {
        const {done} = this.props;
        this.done = !!done;
    }

    @autobind @action
    toggle() {
        this.done = !this.done;
    }

    render(): React.Node  {
        const {title} = this.props;
        const txtStyle = this.done ? Styles.grayText : Styles.whiteText;
        return <View style={[Styles.listItem, { marginHorizontal: 0 }]}>
            <Button transparent
                    onPress={this.toggle}
                    style={[Styles.center, style.button]}>
            </Button>
            <View style={[Styles.center, style.title]}>
                <Text style={txtStyle}>{title}</Text>
            </View>
        </View>;
    }
}

const style = StyleSheet.create({
    mask: {
        backgroundColor: "rgba(0, 0, 0, .5)"
    },
    button: {
        height: 75, width: 75, borderRadius: 0
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
        paddingLeft: variables.contentPadding
    }
});
