// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {CreditCardInput, LiteCreditCardInput, CardView} from "react-native-credit-card-input";
import {View, Image, StyleSheet, Dimensions, Alert, ScrollView, ActivityIndicator, Platform, UIManager} from "react-native";
import {H1, Text, Button, Radio, ListItem, Right, Content, Container, CheckBox, Form, Item, Input, Left, Body, Header, Icon, Title} from "native-base";
import {Conekta, BaseContainer, Images, Styles, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";
import { observer, inject } from "mobx-react/native";
import {action} from "mobx";
//import Conekta from "react-native-conekta";

@inject('store') @observer
export default class CreditCard extends React.Component {

    state = {
      subscription: false,
      isOpen: false,
      last_four: "0000",
      cardNumner: "",
      cvc: "",
      expMonth: "",
      expYear: "",
      cardholderName: "",
      conektaCustomerId: "",
      conektaToken: "",
      loading: false,
      tarjetas: [],
      guardoTarjeta: false,
      isGuardarDisabled: true,
      infoTarjetaLlena: false,
      canTokenizeCard: false,
    }

    componentWillMount() {
      this.setState({shouldUpdate: true});
      // Enable LayoutAnimation under Android
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true)
      }
    }
    componentDidMount() {
      //this.refs.CCInput.setValues({name: })
      this.refreshTarjetas()
    }

    componentWillUnmount() {
      this.setState({shouldUpdate: false});
    }

    open() {
      this.setState({isOpen: true});
    }

    // checks if customer is already a Conekta customer; if so, adds new payment method to customer and sets it as default.
    // if it's not a Conekta customer, it creates a Conekta customer, saves the id to Firebase and singleton storage, and returns that id.
    @autobind @action
    async getCustomerId(): Promise<void> {
      var user = Firebase.auth.currentUser;
      var conektaCustomerId = undefined;

      // check if customer already has a Conekta Id
      const docRef = await Firebase.firestore.collection("usersInfo").doc(user.uid);
      await docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("el wey existe!!  data:", doc.data());
            conektaCustomerId = doc.data().conektaCustomerId;
            if (conektaCustomerId) {
              console.log("y su customer id existe! , ", conektaCustomerId);
              return;
            }
        } else {
            console.log("No conektaCustomerId!");
        }

      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
      console.log("pasando a la seccion que no deberia de haber conektaCustomerId: ", conektaCustomerId);

      if (conektaCustomerId != undefined) {
        console.log("YA EXISTE EN FIREBASE: ", conektaCustomerId)
        this.setState({conektaCustomerId: conektaCustomerId});
        // aca agregar nuevo payment method a Conekta y ponerlo como default.
        // El otro lugar que se cambia de payment method (ya no agregarlo) seria en "usar" tarjeta en Tarjetas.js
        return;
      }
      // send request to AWS lambda to create customer.
      // var conektaApi = new Conekta();
      // conektaApi.setPublicKey('key_KoqjzW5XMEVcwxdqHsCFY4Q');
      // var conektaToken = "";
      // var card = {
      //   cardNumber: this.state.cardNumber,
      //   cvc: this.state.cvc,
      //   expMonth: this.state.expMonth,
      //   expYear: this.state.expYear,
      // }

      //await conektaApi.createToken(card
      //var conektaApi = Conekta()

      //console.log("HEYYYYY ", cardTokenizer, this.cardTokenizer)
    //
    //   var user = Firebase.auth.currentUser;
    //   //this.cardTokenizer = data.tokenizeCard
    //   var tokenizeCard = data.tokenizeCard
    //   var card = {
    //     name: user.displayName,
    //     number: this.state.cardNumber,
    //     cvc: this.state.cvc,
    //     exp_month: this.state.expMonth,
    //     exp_year: this.state.expYear,
    //   }
    //
    //   console.log("HEYYYYY ", tokenizeCard)
    //   //this.setState({isGuardarDisabled: false});
    //   //if (!this.state.isGuardarDisabled) {
    //     console.log("TRYING THISSSS")
    //
    // //  }

    // await tokenizeCard(card, async function(data){
    //   console.log('Conekta TOKEN DATA SUCCESS:', data ); // data.id to get the Token ID
    //   this.setState({conektaToken: data.token});
      // await this.cardTokenizer(card, async function(data){
      //   console.log( 'Conekta TOKEN DATA SUCCESS:', data ); // data.id to get the Token ID
      //   conektaToken = data.id;

        console.log("intentando con el token asi: ", this.state.conektaToken);
        try {
          let response = await fetch('https://d88zd3d2ok.execute-api.us-east-1.amazonaws.com/production/createCustomer', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: this.state.conektaToken,
              name: user.displayName,
              email: user.email,
            }),
          });
          let responseJSON = await response.json();
          console.log("PARA CREAR CUSTOMER responseJSON is: ", responseJSON);

          if (responseJSON.message != "Customer creation successful") {
            console.log("hubo error al crear usuario ", responseJSON.message);
            //reject(responseJSON.message);
          } else {
            conektaCustomerId = responseJSON.customer.id;

            await Firebase.firestore.collection("usersInfo").doc(user.uid).update({conektaCustomerId: conektaCustomerId})
            .then(function() {
                console.log("Updated el conektaCustomerId");
            })
            .catch(function(error) {
                console.error("Error updating conektaCustomerId: ", error.message);
                //Alert.alert("Hubo un error al actualizar el código", error.message);
            });
          }
          //resolve(conektaCustomerId);
        } catch (error) {
          console.error(error);
          //reject(error.message);
        }

      //}
        //});

      // }, function(e){
      //   console.log( 'Conekta Error!', e);
      // });

      console.log("listo aca??? ", conektaCustomerId);
      this.setState({conektaCustomerId: conektaCustomerId});
      this.props.store.conektaCustomerId = conektaCustomerId;

      //});
    }

    @autobind
    async refreshTarjetas(): Promise<void> {
      var user = Firebase.auth.currentUser;
      const docRef = await Firebase.firestore.collection("paymentInfos").doc(user.uid);
      var docExists = false;
      var tarjetas = [];
      await docRef.get().then(function(doc) {
          if (doc.exists) {
              docExists = true;
              tarjetas = doc.data().tarjetas;
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      this.setState({tarjetas: tarjetas});
    }

    @autobind
    testFunction() {
      console.log("heyy");
    }

    @autobind
    async guardarTarjeta(): Promise<void> {
      // guardar credit card details
      this.setState({loading: true});
      var user = Firebase.auth.currentUser;

      console.log("GUARDANDO TARJETA")
      //testFunction();
      console.log("conektaCustomerId before: ", this.state.conektaCustomerId);
      await this.getCustomerId();
      console.log("conektaCustomerId is: ", this.state.conektaCustomerId);
      this.props.store.conektaCustomerId = this.state.conektaCustomerId;

      var tarjetas = this.state.tarjetas;
      for (var i = 0; i < tarjetas.length; i++) {
        tarjetas[i].usando = false;
      }
      tarjetas.push({last4: this.state.last_four, usando: true});

      var paymentInfo = {
        tarjetas: tarjetas,
      }

      await Firebase.firestore.collection("paymentInfos").doc(user.uid).set(paymentInfo)
      .then(function() {
          console.log("Document written");
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });

      this.setState({loading: false, guardoTarjeta: true});
      this.dismissModal();
    }

    @autobind
    dismissModal(){
      //this.setState({isOpen: false});
      if (this.state.guardoTarjeta) {
        this.props.dismissModal(this.state.last_four);
      } else {
        this.props.dismissModal();
      }

    }

    @autobind
    paymentOnChange(info) {
      //this.refs.CCInput.setValues({ number: "4737029071352034" });
      var currNumber = info.values.number;
      console.log("paymentChange" , currNumber);

      console.log("HEYYYY CVC: ", info.values.cvc.length);

      if (currNumber.length > 4) {
        var last4 = currNumber.slice(-4);
        this.setState({last_four: last4, });
      }

      var expMonth = info.values.expiry.split("/")[0];
      var expYear = info.values.expiry.split("/")[1];

      var prevCVC = this.state.cvc;
      this.setState({cardNumber: currNumber, expMonth: expMonth, expYear: expYear, cvc: info.values.cvc});

      var cvcStatus = info.status.cvc;
      var expiryStatus = info.status.expiry;
      var numberStatus = info.status.number;
      var allValid = cvcStatus == "valid" && expiryStatus == "valid" && numberStatus == "valid";
      if (allValid) {
        this.setState({infoTarjetaLlena: true, canTokenizeCard: true, isGuardarDisabled: false});
      } else {
        this.setState({infoTarjetaLlena: false, canTokenizeCard: false, isGuardarDisabled: true});
      }

      if (info.values.cvc.length >= 3 && !allValid && prevCVC != info.values.cvc) {
        Alert.alert("Información de tarjeta es inválida.", "Favor de verificar los números.");
      }


    }

    @autobind
    async tokenizeCardHere(data): Promise<void> {
      console.log("IN THERE ", data)
      var user = Firebase.auth.currentUser;
      //this.cardTokenizer = data.tokenizeCard
      var tokenizeCard = data.tokenizeCard

      console.log("HEYYYYY ", tokenizeCard)

      //this.setState({isGuardarDisabled: false});
      if (this.state.infoTarjetaLlena && this.state.canTokenizeCard) {
        var card = {
          name: user.displayName,
          number: this.state.cardNumber,
          cvc: this.state.cvc,
          exp_month: this.state.expMonth,
          exp_year: this.state.expYear,
        }
        console.log("TRYING THISSSS")
        var token = await tokenizeCard(card);
        // just tokenized so shouldn't tokenize again.
        this.setState({canTokenizeCard: false});

        console.log("WHAT ABOUT HEREEE ", token);

        if (token.id != undefined) {
          this.setState({isGuardarDisabled: false});
          this.setState({conektaToken: token.id});
        } else {
          Alert.alert("Información de tarjeta inválida", "");
        }
      } else {
        //this.setState({tokenizingCard: false});
      }


    }

    @autobind
    cardTokenizer() {

    }

    render(): React.Node {

        return <Modal style={[style.modal]} isOpen={this.props.isOpen} backdropPressToClose={false} backdrop={false} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"} ref={"modal2"}>
                <Container safe={false}>
                  <Header>
                      <Left>
                          <Button transparent onPress={this.dismissModal}>
                              <Icon name="ios-close-outline" style={style.closeIcon} />
                          </Button>
                      </Left>
                      <Body>
                          <Title>PAGO</Title>
                      </Body>
                      <Right />
                  </Header>
                  <Content style={style.content}>
                    {Platform.OS == "android" ? <LiteCreditCardInput ref="CCInput" onChange={this.paymentOnChange} autoFocus={false} labelStyle={style.whiteStyle} inputStyle={style.whiteStyle}/> : <CreditCardInput ref="CCInput" onChange={this.paymentOnChange} autoFocus={false} labelStyle={style.whiteStyle} inputStyle={style.whiteStyle}/>}
                   <ActivityIndicator size="large" animating={this.state.loading}/>
                   <Button disabled={this.state.isGuardarDisabled} primary block onPress={this.guardarTarjeta} style={{ height: variables.footerHeight * 1.3, backgroundColor:  this.state.isGuardarDisabled ? variables.lightGray : variables.brandPrimary}}>
                     <Text style={{color: 'white'}}>GUARDAR</Text>
                   </Button>
                   <Conekta style={{backgroundColor: 'red', height: 0, width: 0, position: 'absolute', bottom: -10}} children={this.tokenizeCardHere}/>
                  </Content>
                </Container>

        </Modal>;
    }
}


// nombre del titular de la tarjeta
const {width} = Dimensions.get("window");
const style = StyleSheet.create({
  modal: {
    backgroundColor: 'white'
  },
  whiteStyle: {
    color: variables.darkGray
  }
});
