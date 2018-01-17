// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import {Button, Icon} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";
import Modal from 'react-native-modalbox';

import {BaseContainer, Styles, JankWorkaround, Task} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Pedidos extends React.Component<ScreenProps<>> {

    state = {
      loading: true,
    }

    constructor(props) {
      super(props);
      this.open = this.open.bind(this);
    }

    componentDidMount() {
      JankWorkaround.runAfterInteractions(() => {
        this.setState({ loading: false });
      });
    }

    open() {
      this.refs.pedidoModal.open();
    }


    render(): React.Node {
        return <BaseContainer title="Pedidos" navigation={this.props.navigation} scrollable>
                  <View>
                  {this.state.loading ? (
                    <Loading />
                  ) : (
                    <View>
                    <TouchableOpacity onPress={this.open}>
                     <Item title="6 ONEFOODS" pedido_id="rigo1"/>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={this.open}>
                    <Item title="1 ONEFOODS" pedido_id="rigo1" done/>
                   </TouchableOpacity>
                   </View>
                  )}
                  </View>
                  <PedidoDetalle ref={"pedidoModal"} pedido_id="rigo1" fecha="23/12/2017" cantidad="3" sabor="Chocolate" precioTotal="50" user_id="rigo" al_mes="false" direccionAEntregar="Isla Dorada"/>
        </BaseContainer>;
    }
}

type PedidoProps = {
  pedido_id: string,
  fecha: string,
  cantidad: number,
  sabor: string,
  precioTotal: number,
  user_id: string,
  al_mes: boolean,
  direccionAEntregar: string
}
class PedidoDetalle extends React.Component<PedidoProps> {
    open() {
      this.refs.modal.open();
    }
    render(): React.Node {
      const {pedido_id} = this.props;
      return <Modal style={[style.modal, style.container]} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
            <Task
                date="2015-05-08 08:30"
                title="New Icons"
                subtitle="Mobile App"
                completed={true}
            />
            <Task
                date="2015-05-08 10:00"
                title="Coffee Break"
                completed={false}
            />
            <Task
                date="2015-05-08 14:00"
                title="Design Stand Up"
                subtitle="Hangouts"
                collaborators={[1, 2, 3]}
                completed={false}
            />
        </Modal>;
    }

}

const Loading = () => (
  <View style={style.container}>
    <Text></Text>
  </View>
);

type ItemProps = {
    title: string,
    pedido_id: string,
    done?: boolean
};

@observer
class Item extends React.Component<ItemProps> {
    @observable done: boolean;

    constructor(props) {
      super(props);
      this.open = this.open.bind(this);
    }
    componentWillMount() {
        const {done} = this.props;
        this.done = !!done;
    }

    @autobind @action
    toggle() {
      console.log("QUE PEDOO");
        this.done = !this.done;
    }

    open() {
      console.log("refs bro: ", this.refs);
      this.refs.pedidoModal.open();
      //this.refs.pedido.open();
      //          <PedidoDetalle ref={"pedido"} pedido_id="rigo1" fecha="23/12/2017" cantidad="3" sabor="Chocolate" precioTotal="50" user_id="rigo" al_mes="false" direccionAEntregar="Isla Dorada"/>

    }

    render(): React.Node  {
        const {title} = this.props;
        const {pedido_id} = this.props;
        const txtStyle = this.done ? Styles.grayText : Styles.whiteText;
        return <View style={[Styles.listItem, { marginHorizontal: 0 }]}>
                    <Button transparent
                            onPress={this.toggle}
                            style={[Styles.center, style.button]}>
                    </Button>
                    <View style={[Styles.center, style.title]}>
                        <Text style={txtStyle}>{title}</Text>
                    </View>
                </View>
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
    },
    modal: {
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#3B5998"
  },
});
