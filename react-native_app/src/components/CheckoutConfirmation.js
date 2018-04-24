// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {View, Dimensions, Image, StyleSheet, ActivityIndicator} from "react-native";
import {Text, Icon, Left, Right, Header, Container, Content, Button, Body, Title} from "native-base";

import {BaseContainer, Images, Field, SingleChoice, PedidoItem, Firebase, Controller} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import { observer, inject } from "mobx-react/native";
import {action} from "mobx";
import variables from "../../native-base-theme/variables/commonColor";
import Pedidos from "../pedidos";
//import store from "../store";

@inject('store') @observer
export default class CheckoutConfirmation extends React.Component<ScreenProps<>> {

    state = {
      isOpen: false,
      loading: false,
    }

    componentDidMount() {
      console.log("hey watagas ", this.props.isCheckoutOpen);
      this.setState({isOpen: this.props.isCheckoutOpen});
    }

    checkOpen() {
      console.log("hey watagas ", this.props.isCheckoutOpen);
      console.log("youu ", this.state.isOpen);
    }

    @autobind
    open() {
      //this.setState({isOpen: true});
      this.props.onOpenChange(true);
    }

    @autobind @action
    async makePurchase(): Promise<void> {
      this.setState({loading: true});
      var date = new Date().toDateString();
      var user = Firebase.auth.currentUser;

      var pedidoId = "O-";
      pedidoId += Math.floor(Math.random() * 300000);
      pedidoId += user.uid;

      var pedido = {
          pedido_id: pedidoId,
          reclamado: false,
          fecha: date,
          cantidades: [this.props.chocolateQuantity, this.props.vanillaQuantity],
          sabores: ["chocolate", "vainilla"],
          precio_total: this.props.totalPrice,
          user_id: user.uid,
          subscription: this.props.subscription,
          domicilio: this.props.domicilio,
      };

      console.log("pedido agregado: ", pedido);
      this.props.store.pedidos.push(pedido);
      //console.log("DAMN ", this.props.store.pedidos);
      //Pedidos.pedidos.push(pedido);
    //  this.props.pedidoHecho(pedido);
      //storeSingleton.pedidos.push(pedido);

      await Firebase.firestore.collection("pedidos").doc(pedidoId).set(pedido)
      .then(function() {
          console.log("Pedido Hecho");

      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
          alert("No se pudo completar la compra en este momento. Por favor intentar en unos minutos.");
      });

      this.setState({loading: false});
      this.props.madeFinalPurchase();
      this.dismissModal();
    }

    @autobind
    dismissModal() {
      this.props.onOpenChange(false);
    }

    render(): React.Node {
      var discount = 0.00;
      var creditDisplay = "**** "+ this.props.lastFour;
      var descEntrega = this.props.domicilio ? "Se te entregará a tu dirección." : "Reclamar en persona.";
      var descSubscription = this.props.subscription ? "Este mismo pedido se te entregará cada mes." : "No, este es un pedido único.";
      var totalPriceDisplay = "$"+this.props.totalPrice;
      var discountedPrice = "$"+this.props.totalPrice*(1-discount);
      return  <Modal style={[style.modal]} isOpen={this.props.isCheckoutOpen} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"} ref={"modal2"}>
              <Container safe={true}>
                <Header>
                    <Left>
                        <Button transparent onPress={this.dismissModal}>
                            <Icon name="ios-close-outline" style={style.closeIcon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>CHECKOUT</Title>
                    </Body>
                    <Right />
                </Header>
                <Content style={style.content}>
                  <View style={style.section}>
                      <Text>RESUMEN</Text>
                      <PedidoItem
                          numero={this.props.chocolateQuantity.toString()}
                          title="CHOCOLATE"
                      />
                      <PedidoItem
                          numero={this.props.vanillaQuantity.toString()}
                          title="VAINILLA"
                      />
                      <PedidoItem
                          numero={discountedPrice}
                          title="TOTAL"
                      />
                      <ActivityIndicator size="large" animating={this.state.loading}/>
                  </View>


                  <View style={style.section}>
                      <Text>MÉTODO DE PAGO</Text>
                      <Text><Icon name="ios-card" style={{ color: variables.brandSecondary }} /> {creditDisplay} </Text>
                  </View>

                  <View style={style.section}>
                      <Text>MÉTODO DE ENTREGA</Text>
                      <Text>{descEntrega}</Text>
                  </View>

                  <View style={style.section}>
                      <Text>SUBSCRIPCIÓN</Text>
                      <Text>{descSubscription}</Text>
                  </View>

                </Content>
                <Button primary block onPress={this.makePurchase} style={{ height: variables.footerHeight * 1.3 }}>
                  <Text>COMPRAR</Text>
                </Button>
              </Container>
      </Modal>;
    }
}

// <PedidoItem
//     numero={totalPriceDisplay}
//     title="SUBTOTAL"
// />
// <PedidoItem
//   numero={"-5%"}
//   title="DESCUENTO POR COMPARTIR"
// />

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750
    },
    add: {
        backgroundColor: "white",
        height: 50,
        width: 50,
        borderRadius: 25,
        position: "absolute",
        bottom: variables.contentPadding,
        left: variables.contentPadding,
        alignItems: "center",
        justifyContent: "center"
    },
    section: {
        padding: variables.contentPadding * 2,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    modal: {
      backgroundColor: variables.brandInfo
    }
});
