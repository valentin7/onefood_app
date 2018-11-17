// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {View, Dimensions, Image, StyleSheet, ActivityIndicator, Alert} from "react-native";
import {Text, Icon, Left, Right, Header, Container, Content, Button, Body, Title} from "native-base";

import {BaseContainer, Conekta, Images, Field, SingleChoice, PedidoItem, Firebase, Controller, Tarjetas, Address} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import { observer, inject } from "mobx-react/native";
import {action} from "mobx";
import variables from "../../native-base-theme/variables/commonColor";
import Pedidos from "../pedidos";
import Moment from "moment";
//import Conekta from "react-native-conekta";
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
      isConfirmationPopUpOpen: false,
      direccionObject: this.props.direccionObject,
    }

    componentDidMount() {
      this.setState({isOpen: this.props.isCheckoutOpen});
      this.setState({direccionCompleta: this.props.direccionCompleta});
      this.setState({direccionObject: this.props.direccionObject});
      this.updateCustomerId();
    }

    @autobind
    open() {
      this.updateSaboresQuantity();
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
              console.log("hey, it exists!! ");
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

      console.log("estas son las cantidades: ", this.props.cantidades);
      console.log("Sabores: ", this.props.sabores);
      var pedido = {
          pedido_id: pedidoId,
          reclamado: false,
          fecha: date,
          cantidades: this.props.cantidades,
          sabores: this.props.sabores,
          precio_total: this.props.totalPrice,
          user_id: user.uid,
          subscription: this.props.subscription,
          subscriptionStatus: "ACTIVA",
          domicilio: this.props.domicilio,
          direccionCompleta: this.state.direccionCompleta,
      };

      // var conektaApi = new Conekta();
      // conektaApi.setPublicKey('key_KoqjzW5XMEVcwxdqHsCFY4Q');
      if (this.props.store.conektaCustomerId == undefined) {
        console.log("tiene que esperar un ratin");
        await this.updateCustomerId();
        if (this.props.store.conektaCustomerId == undefined) {
          this.setState({loading: false});
          Alert.alert("Hubo un error con tu información de pago.", "Favor de agregar una tarjeta nueva.");
          return;
        }
      }

      console.log("hey, here's the conektaCustomerId: ", this.props.store.conektaCustomerId)
      const customerInfo = {'customer_id': this.props.store.conektaCustomerId, 'corporate': this.props.store.esRep};

      if (this.props.subscription) {
        console.log("creating subscription with customerId: ", this.props.store.conektaCustomerId);
        const id = "plan" + this.props.store.subscriptions.length + "_" + user.uid;
        const name = "Plan mensual #" + this.props.store.subscriptions.length + " del usuario " + user.uid;
        const amount = this.props.totalPrice * 100; // conekta trabaja con centavos.
        const currency = "MXN";
        const interval = "month";
        const customerId = this.props.store.conektaCustomerId;

        try {
          let response = await fetch('https://d88zd3d2ok.execute-api.us-east-1.amazonaws.com/production/createSubscription', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
              name: name,
              amount: amount,
              currency: currency,
              interval: interval,
              customerId: customerId,
            }),
          });
          let responseJSON = await response.json();
          console.log("responseJSON is: ", responseJSON);

          if (responseJSON.message != "Subscription creation successful") {
            this.setState({loading: false});
            //Alert.alert("Hubo un error al crear tu subscripción.", responseJSON.message);
            return;
          }

          await Firebase.firestore.collection("usersInfo").doc(user.uid).update({activeSubscription: pedidoId})
          .then(function() {
              console.log("Subscripcion ACTIVADA en FIREBASE");
          })
          .catch(function(error) {
              console.error("Error updating document: ", error);
              //Alert.alert("No se pudo pausar tu subscripción automáticamente en este momento.", "Por favor mandar un email a soporte@onefood.com.mx para pausarla.");
          });

          this.props.store.subscriptionStatus = "ACTIVA";


          console.log("created subscription and deleting ", this.props.userActiveSubscription);
          // pause subscription (firebase) at this.props.userActiveSubscription
          if (this.props.userActiveSubscription != undefined && this.props.userActiveSubscription.length > 1) {
            await Firebase.firestore.collection("pedidos").doc(this.props.userActiveSubscription).delete()
            .then(function() {
                console.log("Subscripcion BORRADA en FIREBASE");
            })
            .catch(function(error) {
                console.error("Error updating document: ", error);
                //Alert.alert("No se pudo pausar tu subscripción automáticamente en este momento.", "Por favor mandar un email a soporte@onefood.com.mx para pausarla.");
            });
            this.props.store.subscriptions = this.props.store.subscriptions.filter(pedido => pedido.pedido_id != this.props.userActiveSubscription);
          }

        } catch (error) {
          console.error(error);
          this.setState({loading: false});
          Alert.alert("Hubo un error al crear tu subscripción.", error.message);
          return;
        }


      } else {

        var lineItems = []

        for (var i = 0; i < this.props.cantidades.length; i++) {
          var isSnack = this.props.sabores[i].split(' ')[1] == "SNACK"
          console.log("ES SNACK? ", this.props.sabores[i], isSnack);
          var unit_price = isSnack ? Constants.PRECIO_SNACK : Constants.PRECIO_BOTELLA;
          unit_price *= 100;
          var item = {"name": this.props.sabores[i],
                      "unit_price": unit_price,
                      "quantity": this.props.cantidades[i]}
          lineItems.push(item)
        }

        console.log("ALL LINE ITEMS: ", lineItems);

        const discountLines =  [];//[{"code": "Cupón de descuento",
                                //"type": "loyalty",
                                //"amount": 600}]; // type can be loyalty, campaign, coupon, sign
        const liveMode = false;
        console.log("TIENE DIRECCION OBJECT?? " , this.props.direccionObject);
        console.log("TIENE segundo ?? " , this.state.direccionObject);
        if (this.props.direccionObject && !this.state.direccionObject) {
          console.log("entro");
          this.setState({direccionObject: this.props.direccionObject});
        }
        console.log("despues ?? " , this.state.direccionObject);


        var shippingContact = {};
        if (this.props.direccionObject) {
          shippingContact = {address: {
              street1: this.props.direccionObject.street1,
              street2: this.props.direccionObject.street2,
              city: this.props.direccionObject.city,
              state: this.props.direccionObject.state,
              country: this.props.direccionObject.country,
              postal_code: this.props.direccionObject.postal_code
          }};
        }

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
            Alert.alert("Hubo un error al crear tu pedido.", responseJSON.message);
            return;
          }
        } catch (error) {
          console.error(error);
          this.setState({loading: false});
          Alert.alert("Hubo un error al hacer tu pedido.", error.message);
          return;
        }
      }

      if (this.props.subscription) {
        console.log("DOING IT HEREEE");
        this.props.store.subscriptionStatus = "ACTIVA";
        this.props.store.subscriptions.push(pedido);
      } else {
        console.log("ON THE OTHER ONE");
        this.props.store.pedidos.push(pedido);
      }

      await Firebase.firestore.collection("pedidos").doc(pedidoId).set(pedido)
      .then(function() {
          console.log("Pedido Hecho");
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
          Alert.alert("No se pudo completar la compra en este momento.", "Por favor contactarnos.");
          return;
      });

      this.setState({loading: false});

      this.refs.popUpModal.open();

    }

    @autobind
    onPopUpClosed() {
      console.log("HEY here boi")
      this.props.madeFinalPurchase();
      this.dismissModal();
    }

    // @autobind
    // onConfirmationOkClick() {
    //
    //   //this.setState({isConfirmationPopUpOpen: false});
    //
    // }

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

      let mensajePopUp = "Encuentra alguno de nuestros representantes en el mapa y enséñales el código QR de tu pedido. Puedes ver tus pedidos al continuar."
      if (this.props.domicilio) {
        mensajePopUp = "Tu pedido se entregará entre " + fechaMin + " y " + fechaMax + "."
      }

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
                      {this.props.sabores.map((sabor, index) => (
                        <PedidoItem
                            numero={this.props.cantidades[index].toString()}
                            title={sabor}
                            key={index}
                        />
                      ))}
                      <PedidoItem
                          numero={"$" + this.props.totalPrice.toString()}
                          title={"TOTAL"}
                      />
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
                  <ActivityIndicator size="small" color="white" style={{left: -30, marginRight: 5, position: "relative"}} animating={this.state.loading} />
                  <Text style={{color: 'white', left: -5}}>COMPRAR</Text>
                </Button>
              </Container>

              <Address isOpen={this.state.isAddressModalOpen} dismissModal={this.dismissAddressModal}> </Address>
              <Modal style={style.popUpModal} swipeToClose={true} position={"center"} onClosed={this.onPopUpClosed} backdrop={true} coverScreen={false} ref={"popUpModal"}>
                  <Container style={style.containerChico}>
                    <Text style={{fontSize: 22, fontWeight: "bold"}}>¡Pago confirmado!</Text>
                    <View style={{marginTop: 20, margin: 15, alignItems: "center", justifyContent: "center", flex: 1, flexDirection: 'column',}}>
                      <Text>
                       {mensajePopUp}
                      </Text>
                      <View style={{marginTop: 15}}>
                      <Button style={{borderRadius: 5, width: 120, alignItems: "center", justifyContent: "center"}} onPress={() => this.refs.popUpModal.close()}><Text style={{color: "white"}}>OK</Text></Button>
                      </View>
                    </View>
                  </Container>
               </Modal>
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
    popUpModal: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: variables.brandInfo,
      height: 270,
      width: 270,
      borderRadius: 5,
    },
    containerChico: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 270,
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
