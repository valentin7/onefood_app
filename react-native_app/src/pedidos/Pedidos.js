// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import {Button, Icon, Left, Right, H3} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";
import Modal from 'react-native-modalbox';
import QRCode from 'react-native-qrcode';

import {BaseContainer, Styles, JankWorkaround, Task, PedidoItem} from "../components";
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

    @autobind
    dismissModal() {
      this.setState({isOpen: false});
    }


    render(): React.Node {
        return <BaseContainer title="Pedidos" navigation={this.props.navigation} scrollable>
                  <View>
                  {this.state.loading ? (
                    <Loading />
                  ) : (
                    <View>
                    <TouchableOpacity onPress={this.open}>
                     <Item title="36 ONEFOODS" pedido_id="rigo1"/>
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

    state = {
      detailModalIsOpen: false,
    }

    open() {
      this.setState({detailModalIsOpen: true});
      //this.refs.modal.open();
    }

    @autobind
    setModalStateClosed() {
      this.setState({detailModalIsOpen: false});
    }

    @autobind
    dismissModal() {
      this.setState({detailModalIsOpen: false});
    }

    render(): React.Node {
      const {pedido_id} = this.props;
      return <Modal style={[style.modal, style.container]} onClosed={this.setModalStateClosed}  isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
          <Button transparent onPress={this.dismissModal}>
              <Icon name="ios-close-outline" style={style.closeIcon} />
          </Button>
          <QRCode
                value={"O-89098"}
                size={200}
                bgColor='purple'
                fgColor='white'/>
            <PedidoItem
                numero="12"
                title="CHOCOLATE"
            />
            <PedidoItem
                numero="24"
                title="VAINILLA"
            />
            <View style={{marginTop: 20}}>
              <H3>Marzo 1, 2018</H3>
            </View>

        </Modal>;
    }

}

//  <Text>Entrega a domicilio</Text>
  //<Text>Polanco 4815, Torre 16, Numero 23\n 42, Ciudad de Mexico</Text>
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
        this.done = !this.done;
    }

    open() {
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
    closeIcon: {
        fontSize: 50,
        marginLeft: 20,
        color: variables.listBorderColor
    },
    number: {
        alignItems: "center",
        flexDirection: "row",
        padding: variables.contentPadding
    },
    title: {
        justifyContent: "center",
        flex: 1,
        padding: variables.contentPadding
    },
    titleText: {
        fontSize: variables.fontSizeBase * 2 + variables.contentPadding,
        color: "white"
    },
    timelineLeft: {
        flex: .5,
        borderRightWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    timelineRight: {
        flex: .5,
        justifyContent: "flex-end"
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
