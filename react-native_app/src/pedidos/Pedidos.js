// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from "react-native";
import {Button, Icon, Left, Right, H3, Separator, ListItem, List} from "native-base";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";
import Modal from 'react-native-modalbox';
import QRCode from 'react-native-qrcode';
import store from "../store";

import {BaseContainer, Styles, JankWorkaround, Task, PedidoItem, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";
import PedidoModel from "../components/APIStore";

import variables from "../../native-base-theme/variables/commonColor";

export default class Pedidos extends React.Component<ScreenProps<>> {

    state = {
      loading: true,
      pedidos: [],
      pedidosHistorial: [],
    }

    constructor(props) {
      super(props);
      this.open = this.open.bind(this);
    }

    @autobind
    async refreshPedidos(): Promise<void> {
      var user = Firebase.auth.currentUser;

      if (user == null) {
        return;
      }

      const query = await Firebase.firestore.collection("pedidos").where("user_id", "==", user.uid).get().catch(function(error) {
          console.log("Error getting documents: ", error);
      });
      const pedidos = [];
      const pedidosHistorial = [];
      query.forEach(doc => {
        if (doc.data().reclamado) {
          pedidosHistorial.push(doc.data());
        } else {
          pedidos.push(doc.data());
          //store.pedidos.push(doc.data());
        }
      });

      this.setState({
        pedidos,
        pedidosHistorial,
        loading: false
      });

    }

    async componentWillMount(): Promise<void> {
      await this.refreshPedidos().catch(function(error) {
        console.error("wadduppp: ", error);
      });
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

    @autobind
    pedidoHecho(pedido) {
      this.setState({pedidos: this.state.pedidos.push(pedido)});
      //store.pedidos.push(pedido);
    }

    @autobind
    comprar() {
      this.refs.baseComponent.comprar();
    }

    render(): React.Node {
        console.log("rendering pedidos now too");
        return <BaseContainer ref="baseComponent" title="Pedidos" navigation={this.props.navigation} >
                  <View>
                  {this.state.loading ? (
                    <Loading />
                  ) : (
                    <View>
                    <Button block style={style.compraButton} onPress={this.comprar}>
                      <H3>Nueva Compra</H3>
                    </Button>
                    <View scrollable>
                    { this.state.pedidos.length > 0 ? (
                      <Separator style={style.divider}>
                        <Text style={{color: "white", fontWeight: "bold"}}>Pedidos a reclamar</Text>
                      </Separator>
                    ) : (<View/>)}

                    <List dataArray={this.state.pedidos} renderRow={
                      (item) => (
                        <ListItem style={{height: 70}} onPress={this.open}>
                        <Text style={{color: "white"}}> {item.cantidades[0]} ONEFOODS</Text>
                      </ListItem>)
                    } />
                    { this.state.pedidosHistorial.length > 0 ? (
                      <Separator style={style.divider}>
                        <Text style={{color: "white", fontWeight: "bold"}}>Historial de Pedidos</Text>
                      </Separator>
                    ) : (<View/>)}

                   <List dataArray={this.state.pedidosHistorial} renderRow={
                     (item) => (
                       <ListItem style={{height: 70}} onPress={this.open}>
                       <Text style={Styles.grayText}> {item.cantidades[0]} ONEFOODS</Text>
                     </ListItem>)
                   } />
                   </View>
                   </View>
                  )}
                  </View>
                  <PedidoDetalle ref={"pedidoModal"} pedido_id="rigo1" fecha="23/12/2017" cantidad="3" sabor="Chocolate" precioTotal="50" user_id="rigo" al_mes="false" direccionAEntregar="Isla Dorada"/>
        </BaseContainer>;
    }
}

//{this.state.pedidos.forEach(pedido => <PedidoDetalle ref={"pedidoModal"} pedido_id={pedido.pedido_id} fecha={pedido.fecha} cantidades={pedido.cantidades} precioTotal={pedido.precio_total}/>)}

type PedidoProps = {
  pedido_id: string,
  fecha: string,
  cantidades: number[],
  sabores: string[],
  precioTotal: number,
  user_id: string,
  subscription: boolean,
  domicilio: string
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
      const {pedido_id, fecha, cantidades, precioTotal} = this.props;
      return <Modal style={[style.modal, style.container]} onClosed={this.setModalStateClosed}  isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
          <Button transparent onPress={this.dismissModal}>
              <Icon name="ios-close-outline" style={style.closeIcon} />
          </Button>
          <QRCode
                value={"O-232323"}
                size={200}
                bgColor='purple'
                fgColor='white'/>
            <PedidoItem
                numero={5}
                title="CHOCOLATE"
            />
            <PedidoItem
                numero={1}
                title="VAINILLA"
            />
            <View style={{marginTop: 20}}>
              <H3>12 Marzo, 2018</H3>
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
                    <View style={[Styles.center, style.title]}>
                        <Text style={txtStyle}>{title}</Text>
                    </View>
                </View>
    }
}

const {width} = Dimensions.get("window");

const style = StyleSheet.create({
    mask: {
        backgroundColor: "rgba(0, 0, 0, .5)"
    },
    button: {
        height: 75, width: 75, borderRadius: 0
    },
    compraButton: {
        height: 60,
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
    divider: {
      backgroundColor: variables.listSeparatorBg,
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
    backgroundColor: variables.brandSecondary
  },
});
