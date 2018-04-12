// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {View, Dimensions, Image, StyleSheet} from "react-native";
import {Text, Icon, Left, Right, Header, Container, Content, Button, Body, Title} from "native-base";

import {BaseContainer, Images, Field, SingleChoice, PedidoItem, Firebase, Controller} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";
import Pedidos from "../pedidos";
//import store from "../store";

export default class CheckoutConfirmation extends React.Component<ScreenProps<>> {

    state = {
      isOpen: false,
    }

    open() {
      this.setState({isOpen: true});
    }

    @autobind
    async makePurchase(): Promise<void> {
      var date = new Date().toDateString();
      var user = Firebase.auth.currentUser;

      var controllerInstance = Controller.getInstance();

      //Controller.sharedInstance.printHelloWorld();
      // console.log("STORE is ", storeSingleton);
      // console.log("hey, the numClicks is ", storeSingleton.numClicks);
      //store.numClicks = 77;

      console.log("dem pedidos are: ", controllerInstance);


      console.log("date is ", date);
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

      console.log("pedido: ", pedido);


      controllerInstance.pedidos.push(pedido);
      console.log("DAMN ", controllerInstance.pedidos);
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

      this.props.madeFinalPurchase();
      this.dismissModal();
    }

    @autobind
    dismissModal() {
      this.setState({isOpen: false});
    }

    render(): React.Node {
      var creditDisplay = "**** "+ this.props.lastFour;
      var descEntrega = this.props.domicilio ? "Se te entregará a tu dirección." : "Reclamar en persona.";
      var descSubscription = this.props.subscription ? "Este mismo pedido se te entregará cada mes." : "No, este es un pedido único.";
      var totalPriceDisplay = "$"+this.props.totalPrice;
      return  <Modal style={[style.modal]} isOpen={this.state.isOpen} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"} ref={"modal2"}>
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
                          numero={totalPriceDisplay}
                          title="TOTAL"
                      />
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


                  <View>

                  </View>
                </Content>
                <Button primary block onPress={this.makePurchase} style={{ height: variables.footerHeight * 1.3 }}>
                  <Text>COMPRAR</Text>
                </Button>
              </Container>
      </Modal>;
    }
}

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
