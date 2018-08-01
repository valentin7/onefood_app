// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {View, Dimensions, Image, StyleSheet, ActivityIndicator, Alert} from "react-native";
import {Text, Icon, Left, Right, Header, Container, Content, Button, Body, Title} from "native-base";

import {BaseContainer, Images, Field, SingleChoice, PedidoItem, Firebase, Controller, Tarjetas, Address} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import { observer, inject } from "mobx-react/native";
import {action} from "mobx";
import variables from "../../native-base-theme/variables/commonColor";
import Pedidos from "../pedidos";
import Moment from "moment";
import Conekta from "react-native-conekta";
import localization from "moment/locale/es";
import * as Constants from "../Constants";

@inject('store') @observer
export default class CheckoutConfirmation extends React.Component<ScreenProps<>> {

    state = {
      isOpen: false,
      loading: false,
      isTarjetasOpen: false,
      last4: "",
      direccionCompleta: "",
      isAddressModalOpen: false,
    }

    componentDidMount() {
      console.log("hey watags ", this.props.isCheckoutOpen);
      this.setState({isOpen: this.props.isCheckoutOpen});
      this.setState({direccionCompleta: this.props.direccionCompleta});
      this.updateCustomerId();
    }

    componentWillMount() {
    }
    componentWillUnmount() {
      console.log("unmounting checkout");
    }

    @autobind
    open() {
      this.props.onOpenChange(true);
    }

    @autobind @action
    async updateCustomerId(): Promise<void> {
      var user = Firebase.auth.currentUser;

      const docRef = await Firebase.firestore.collection("usersInfo").doc(user.uid);
      var docExists = false;
      var conektaCustomerId = undefined;
      await docRef.get().then(function(doc) {
          if (doc.exists) {
              docExists = true;
              conektaCustomerId = doc.data().conektaCustomerId;
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      this.props.store.conektaCustomerId = conektaCustomerId;
    }

    @autobind @action
    async makePurchase(): Promise<void> {
      this.setState({loading: true});
      Moment.locale('en');
      var date = Moment().format("dddd, D MMMM YYYY, h:mma");
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
          direccionCompleta: this.state.direccionCompleta,
      };

      var conektaApi = new Conekta();
      console.log("conektaApi 1st: ", conektaApi);
      conektaApi.setPublicKey('key_KoqjzW5XMEVcwxdqHsCFY4Q');
      console.log("conektaApi: ", conektaApi);

      if (this.props.store.conektaCustomerId == undefined) {
        console.log("tiene que esperar un ratin");
        await this.updateCustomerId();
      }

    //     const customerInfo = request.body.customerInfo;
    // const lineItems = request.body.lineItems;
    // const discountLines = request.body.discountLines;
    // const liveMode = request.body.liveMode;
    // const shippingContact = request.body.shippingContact;
    // const amount = request.body.amount;
    // const metadata = request.body.metadata;

      const customerInfo = {'customer_id': this.props.store.conektaCustomerId, 'corporate': this.props.store.esRep};

      const lineItems =  [{"name": "ONEFOOD COCOA",
                          "unit_price": Constants.PRECIO_BOTELLA * 100,
                          "quantity": this.props.cocoaQuantity}];
      const discountLines = [{"code": "Cupón de descuento",
                              "type": "loyalty",
                              "amount": 600}]; // type can be loyalty, campaign, coupon, sign
      const liveMode = false;
      console.log("TIENE DIRECCION OBJECT?? " , this.props.direccionObject);
      var shippingContact = {"address": this.props.direccionObject};
      if (!this.props.domicilio) {
        shippingContact = {address: {
            street1: "El usuario lo recoge",
            city: "Ciudad de Mexico",
            state: "Ciudad de Mexico",
            country: "mx",
            postal_code: "78215"
        }};
      }
       
      const metadata = {"nota": ""};

      console.log("creating order with customerId: ", this.props.store.conektaCustomerId);
      try {
        let response = await fetch('https://d88zd3d2ok.execute-api.us-east-1.amazonaws.com/production/createOrder', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerInfo: customerInfo,
            lineItems: lineItems,
            discountLines: discountLines,
            shippingContact: shippingContact,
            metadata: metadata,
            type: 'singleOrder',
            domicilio: this.props.domicilio,
          }),
        });
        let responseJSON = await response.json();
        console.log("responseJSON is: ", responseJSON);

        if (responseJSON.message != "Order made succesfully") {
          this.setState({loading: false});
          Alert.alert("Hubo un error al hacer tu pedido.", responseJSON.message);
          return;
        }
      } catch (error) {
        console.error(error);
        this.setState({loading: false});
        Alert.alert("Hubo un error al hacer tu pedido.", error.message);
        return;
      }



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
          Alert.alert("No se pudo completar la compra en este momento.","Por favor intentar en unos minutos.");
      });

      this.setState({loading: false});
      this.props.madeFinalPurchase();
      this.dismissModal();
    }

    // var conektaToken = "";
    // await conektaApi.createToken({
    //   cardNumber: '4242424242424242',
    //   cvc: '111',
    //   expMonth: '11',
    //   expYear: '21',
    // }, function(data){
    //   console.log( 'Conekta TOKEN DATA SUCCESS:', data ); // data.id to get the Token ID
    //   conektaToken = data.id;
    // }, function(e){
    //   console.log( 'Conekta Error!', e);
    // });

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

    @autobind
    dismissAddressModal(last4, finished, direccionCompleta, direccionObject) {
      console.log("Aqui chinoo, ", last4, finished);

      this.setState({isAddressModalOpen: false});

      if (finished) {
        // means they actually wanted to change it.
        this.setState({direccionCompleta: direccionCompleta, direccionObject: direccionObject});
        //setTimeout(() => {this.setState({isCheckoutOpen: true});}, 410);
      } else {
        // means they cancelled the change and address stays the same.
        console.log("address stays the same");
      }
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
        if (this.state.direccionCompleta.length > 1) {
          descEntrega += this.state.direccionCompleta;
        } else {
          descEntrega += this.props.direccionCompleta;
        }
      }


      Moment.updateLocale('es', localization);
      var fechaMin = Moment().add(5, 'days').format("dddd, D MMMM");
      var fechaMax = Moment().add(11, 'days').format("dddd, D MMMM");
      var descExtraDias = "\nEntrega en 5 a 11 días: entre " + fechaMin + " y " + fechaMax + ".";

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

                  <View style={style.section}>
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
                      {this.props.domicilio && <Button onPress={() => this.setState({isAddressModalOpen: true})} style={{width: 150, height: 25, marginTop: 10, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center'}}>
                        <Text style={{fontSize: 12, color: variables.darkGray}}>CAMBIAR DIRECCIÓN</Text>
                      </Button>}
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
              <Address isOpen={this.state.isAddressModalOpen} dismissModal={this.dismissAddressModal}> </Address>
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
