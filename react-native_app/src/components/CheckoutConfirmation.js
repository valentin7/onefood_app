// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {View, Dimensions, Image, StyleSheet, ActivityIndicator} from "react-native";
import {Text, Icon, Left, Right, Header, Container, Content, Button, Body, Title} from "native-base";

import {BaseContainer, Images, Field, SingleChoice, PedidoItem, Firebase, Controller, Tarjetas, Address} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import { observer, inject } from "mobx-react/native";
import {action} from "mobx";
import variables from "../../native-base-theme/variables/commonColor";
import Pedidos from "../pedidos";
import Moment from 'moment';
import localization from 'moment/locale/es';

//import 'moment/min/moment-with-locales';
import * as Constants from '../Constants';
//

@inject('store') @observer
export default class CheckoutConfirmation extends React.Component<ScreenProps<>> {

    state = {
      isOpen: false,
      loading: false,
      isTarjetasOpen: false,
      last4: "",
    }

    componentDidMount() {
      console.log("hey watags ", this.props.isCheckoutOpen);
      this.setState({isOpen: this.props.isCheckoutOpen});

    //  this.setState({last4: this.props.store.last4CreditCard});
      //this.setState({last4: this.props.lastFour});
    }

    componentWillMount() {
    }
    componentWillUnmount() {
      console.log("unmounting checkout");
    }

    @autobind
    open() {
      //this.setState({isOpen: true});
      this.props.onOpenChange(true);
    }

    @autobind @action
    async makePurchase(): Promise<void> {
      this.setState({loading: true});
      Moment.locale('en');
      var date = Moment().format("dddd, D MMMM YYYY, h:mma");
      //var date = new Date().toDateString();
      var user = Firebase.auth.currentUser;

      var pedidoId = "O-";
      pedidoId += Math.floor(Math.random() * 300000);
      pedidoId += user.uid;

      var pedido = {
          pedido_id: pedidoId,
          reclamado: false,
          fecha: date,
          cantidades: [this.props.cocoaQuantity],
          sabores: ["COCOA"],
          precio_total: this.props.totalPrice,
          user_id: user.uid,
          subscription: this.props.subscription,
          domicilio: this.props.domicilio,
      };

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
      console.log("Dismissing the checout");
      this.props.onOpenChange(false);
    }
    @autobind
    dismissTarjetasModal(last4) {
      this.setState({last4: last4});
      this.setState({isTarjetasOpen: false});
    }

    render(): React.Node {
      var discount = 0.00;
      var creditDisplay = "    **** "+ this.props.lastFour;
      if (this.state.last4.length > 1) {
        creditDisplay = "    **** "+ this.state.last4;
      }
      var tieneDireccion = this.props.domicilio || this.props.subscription;
      var descEntrega = tieneDireccion ? "Se te entregará a tu dirección: \n" : "Reclamar en persona.";
      var descSubscription = this.props.subscription ? "Este mismo ONEFOOD KIT se te entregará cada mes en el rango de fechas que se muestran." : "No, este es un pedido único.";
      var totalPriceDisplay = "$"+this.props.totalPrice;
      var discountedPrice = "$"+this.props.totalPrice*(1-discount);

      if (this.props.direccionCompleta.length > 1) {
        descEntrega += this.props.direccionCompleta;
      }


      Moment.updateLocale('es', localization);

      var fechaMin = Moment().add(5, 'days').format("dddd, D MMMM"); //.format("dddd, D MMMM YYYY, h:mma");;
      var fechaMax = Moment().add(11, 'days').format("dddd, D MMMM"); //.format("dddd, D MMMM YYYY, h:mma");;

      console.log("watagit: ", fechaMin);
      var descExtraDias = "\nEntrega en 5 a 11 días: entre " + fechaMin + " y " + fechaMax + "."

      return  <Modal style={[style.modal]} isOpen={this.props.isCheckoutOpen} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"} ref={"modal2"}>
              <Container safe={true}>
                <Header style={{borderBottomWidth: 1, borderColor: variables.lightGray}}>
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
                      <Text style={style.sectionTitle}>RESUMEN</Text>
                      <PedidoItem
                          numero={this.props.cocoaQuantity.toString()}
                          title="COCOA"
                      />
                      <PedidoItem
                          numero={discountedPrice}
                          title="TOTAL"
                      />
                      <ActivityIndicator size="large" animating={this.state.loading}/>
                  </View>

                  <View style={[style.section, {flexDirection: 'column'}]}>
                      <Text style={style.sectionTitle}>MÉTODO DE PAGO</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{marginBottom: 10}}>
                          <Icon name="ios-card" style={{ color: variables.brandSecondary, marginRight: 30 }} />
                          {creditDisplay}
                        </Text>
                        <Button onPress={() => this.setState({isTarjetasOpen: true})} style={{width: 70, height: 25, marginTop: 5, marginLeft: 10, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center', position: 'absolute', right: 0}}>
                          <Text style={{fontSize: 12, color: variables.darkGray}}>EDITAR</Text>
                        </Button>
                      </View>
                      {this.props.subscription && <Text>Cargo Mensual</Text>}
                  </View>
                  <Tarjetas isTarjetasOpen={this.state.isTarjetasOpen} dismissTarjetasModal={this.dismissTarjetasModal} creditDisplay={creditDisplay}></Tarjetas>

                  <View style={style.section}>
                      <Text style={style.sectionTitle}>MÉTODO DE ENTREGA</Text>
                      <Text>{descEntrega}</Text>
                      {this.props.domicilio && <Text>{descExtraDias}</Text>}
                  </View>

                  <View style={style.section}>
                      <Text style={style.sectionTitle}>SUBSCRIPCIÓN</Text>
                      <Text>{descSubscription}</Text>
                  </View>

                </Content>
                <Button primary block onPress={this.makePurchase} style={{ height: variables.footerHeight * 1.3 }}>
                  <Text style={{color: 'white'}}>COMPRAR</Text>
                </Button>
              </Container>
              <Address ref={"modal"}></Address>
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
    sectionTitle : {
      marginBottom: 10,
      fontWeight: 'bold',
      color: variables.darkGray
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
