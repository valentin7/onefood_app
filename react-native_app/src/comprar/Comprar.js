// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, ImageBackground, StyleSheet, Dimensions, InteractionManager, Platform, Animated, ScrollView, ActivityIndicator, SafeAreaView, StatusBar, Alert} from "react-native";
import {H1, Text, Button, Segment, Radio, List, ListItem, Right, Content, CheckBox, Container, Header, Left, Icon, Title, Body, Footer, Card, CardItem, Fab} from "native-base";
import ImageSlider from 'react-native-image-slider';
import {TaskOverview, Images, Styles, PrecioTotal, QuantityInput, ScanCoupon, Address, Firebase, CreditCard, CheckoutConfirmation, WindowDimensions, MapaComponent} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import {StackRouter} from 'react-navigation';
import {action, observable} from "mobx";
import {Location, Permissions} from "expo";
import { observer, inject } from "mobx-react/native";
import PedidoModel from "../components/APIStore";
import Swiper from "react-native-swiper";
import * as Constants from '../Constants';
import variables from "../../native-base-theme/variables/commonColor";
import openMap from 'react-native-open-maps';
import MapView, {Marker} from "react-native-maps";
import Moment from 'moment';
import localization from 'moment/locale/es';

@inject('store') @observer
export default class Comprar extends React.Component {
    static router = ComprarRouter;

    state = {
      subscription: false,
      domicilio: false,
      isOpen: false,
      totalPrice: Constants.PRECIO_BOTELLA,
      singleBotellaPrice: Constants.PRECIO_BOTELLA,
      singleSnackPrice: Constants.PRECIO_SNACK,
      cocoaQuantity: 1,
      frutosRojosQuantity: 1,
      chaiQuantity: 1,
      defaultQuantity: 1,
      defaultIncrement: 1,
      credit_last4: "0000",
      isCheckoutOpen: false,
      loading: false,
      direccionCompleta: "",
      direccionObject: undefined,
      isCreditCardModalOpen: false,
      isAddressModalOpen: false,
      isMapaOpen: false,
      sabores: [],
      cantidades: [],
      userActiveSubscription: "",
    }

    componentWillMount() {
      //if (this.props.store.esRep == undefined) {
      //}
    }


    componentDidMount() {
      this.setDefaultPrices();
      // this.refs.cocoaQuantity.quantity = this.state.defaultQuantity;
      // if (this.state.domicilio) {
      //   this.updateMinimumToDomicilio();
      // }
    }

    @autobind
    setDefaultPrices() {
      console.log("Setting the defaultss");
      //var amount = this.state.domicilio ? 6 : 1;
      //this.setState({defaultQuantity: amount});
      if (this.props.store.esRep) {
        this.setState({singleBotellaPrice: Constants.PRECIO_BOTELLA_REP});
        this.setState({snackBotellaPrice: Constants.PRECIO_BOTELLA_REP});
      }
      this.calculateTotalPrice();
    }

    @autobind
    calculateTotalPrice() {
      var cocoaPrice = this.state.singleBotellaPrice * this.props.store.cocoaQuantity;
      var chaiPrice = this.state.singleBotellaPrice * this.props.store.chaiQuantity;
      var frutosPrice = this.state.singleBotellaPrice * this.props.store.frutosQuantity;
      var mixtoPrice = this.state.singleBotellaPrice * this.props.store.mixtoQuantity;
      var cocoaSnackPrice = this.state.singleSnackPrice * this.props.store.cocoaSnackQuantity;
      var frutosSnackPrice = this.state.singleSnackPrice * this.props.store.frutosSnackQuantity;
      var chaiSnackPrice = this.state.singleSnackPrice * this.props.store.chaiSnackQuantity;
      var mixtoSnackPrice = this.state.singleSnackPrice * this.props.store.mixtoSnackQuantity;
      var newTotalPrice = cocoaPrice + chaiPrice + frutosPrice + mixtoPrice + cocoaSnackPrice + chaiSnackPrice + frutosSnackPrice + mixtoSnackPrice;

      //var newTotalPrice = this.state.singleBotellaPrice * minimumQuantity;
      newTotalPrice = parseFloat(newTotalPrice.toFixed(2));
      this.setState({totalPrice: newTotalPrice});
      this.props.store.totalPrice = newTotalPrice;
    }

    @autobind @action
    async updateRepStatus(): Promise<void> {
      var user = Firebase.auth.currentUser;

      const docRef = await Firebase.firestore.collection("usersInfo").doc(user.uid);
      var docExists = false;
      var isRep = false;
      var phoneNumber = "";
      await docRef.get().then(function(doc) {
          if (doc.exists) {
              docExists = true;
              isRep = doc.data().esRep;
              if (isRep) {
                phoneNumber = doc.data().phone;
              }
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      this.props.store.esRep = isRep;
      this.props.store.repPhone = phoneNumber;

      this.setDefaultPrices();
    }

    @autobind @action
    open() {

      // this.setState({totalPrice: this.state.singleBotellaPrice});
      // if (this.state.domicilio) {
      //   this.updateMinimumToDomicilio();
      // }
      // this.setState({isOpen: true});
    }

    @autobind
    toggleSubscriptionYes() {
      this.setState({subscription: true});
    }

    @autobind
    toggleSubscriptionNo() {
      this.setState({subscription: false});
    }

    @autobind @action
    toggleDomicilioYes() {
      var currentPrice = this.state.totalPrice;
      this.setState({domicilio: true});
      this.updateMinimumToDomicilio();
    }

    @autobind @action
    async updateUserHasSubscription(): Promise<void> {
      var user = Firebase.auth.currentUser;
      const docRef = await Firebase.firestore.collection("usersInfo").doc(user.uid);
      var docExists = false;
      var activeSubscription = "";
      await docRef.get().then(function(doc) {
          if (doc.exists) {
              docExists = true;
              activeSubscription = doc.data().activeSubscription;
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      this.setState({userActiveSubscription: activeSubscription})
    }

    @autobind @action
    updateMinimumToDomicilio(){
      var minimumQuantity = 0;
      if (this.refs.cocoaQuantity.quantity != 0 && this.refs.cocoaQuantity.quantity % 6 != 0) {
        this.refs.cocoaQuantity.quantity = minimumQuantity;
        this.props.store.cocoaQuantity = minimumQuantity;
      }
      if (this.refs.chaiQuantity.quantity != 0 && this.refs.chaiQuantity.quantity % 6 != 0) {
        this.refs.chaiQuantity.quantity = minimumQuantity;
        this.props.store.chaiQuantity = minimumQuantity;
      }
      if (this.refs.frutosQuantity.quantity != 0 && this.refs.frutosQuantity.quantity % 6 != 0) {
        this.refs.frutosQuantity.quantity = minimumQuantity;
        this.props.store.frutosQuantity = minimumQuantity;
      }
      if (this.refs.mixtoQuantity && this.refs.mixtoQuantity.quantity != 0 && this.refs.mixtoQuantity.quantity % 6 != 0) {
        this.refs.mixtoQuantity.quantity = minimumQuantity;
        this.props.store.mixtoQuantity = minimumQuantity;
      }

      if (this.refs.cocoaSnackQuantity.quantity != 0 && this.refs.cocoaSnackQuantity.quantity % 6 != 0) {
        this.refs.cocoaSnackQuantity.quantity = minimumQuantity;
        this.props.store.cocoaSnackQuantity = minimumQuantity;
      }
      if (this.refs.chaiSnackQuantity.quantity != 0 && this.refs.chaiSnackQuantity.quantity % 6 != 0) {
        this.refs.chaiSnackQuantity.quantity = minimumQuantity;
        this.props.store.chaiSnackQuantity = minimumQuantity;
      }
      if (this.refs.frutosSnackQuantity.quantity != 0 && this.refs.frutosSnackQuantity.quantity % 6 != 0) {
        this.refs.frutosSnackQuantity.quantity = minimumQuantity;
        this.props.store.frutosSnackQuantity = minimumQuantity;
      }
      if (this.refs.mixtoSnackQuantity && this.refs.mixtoSnackQuantity.quantity != 0 && this.refs.mixtoSnackQuantity.quantity % 6 != 0) {
        this.refs.mixtoSnackQuantity.quantity = minimumQuantity;
        this.props.store.mixtoSnackQuantity = minimumQuantity;
      }

      this.refs.cocoaQuantity.incrementAmount = 6;
      this.refs.chaiQuantity.incrementAmount = 6;
      this.refs.frutosQuantity.incrementAmount = 6;

      this.refs.cocoaSnackQuantity.incrementAmount = 6;
      this.refs.chaiSnackQuantity.incrementAmount = 6;
      this.refs.frutosSnackQuantity.incrementAmount = 6;

      if (this.refs.mixtoQuantity && this.refs.mixtoSnackQuantity) {
        this.refs.mixtoQuantity.incrementAmount = 6;
        this.refs.mixtoSnackQuantity.incrementAmount = 6;
      }
      this.calculateTotalPrice();
      this.setState({defaultIncrement: 6});
    }

    @autobind @action
    toggleDomicilioNo() {
      console.log("HEREE");
      this.refs.cocoaQuantity.incrementAmount = 1;
      this.refs.chaiQuantity.incrementAmount = 1;
      this.refs.frutosQuantity.incrementAmount = 1;
      this.refs.mixtoQuantity.incrementAmount = 1;
      this.refs.cocoaSnackQuantity.incrementAmount = 1;
      this.refs.chaiSnackQuantity.incrementAmount = 1;
      this.refs.frutosSnackQuantity.incrementAmount = 1;
      this.refs.mixtoSnackQuantity.incrementAmount = 1;

      this.refs.mixtoQuantity.quantity = 0;
      this.refs.mixtoSnackQuantity.quantity = 0;
      this.props.store.mixtoQuantity = 0;
      this.props.store.mixtoSnackQuantity = 0;
      this.calculateTotalPrice();

      this.setState({defaultIncrement: 1});
      // maybe here
    //  this.setState({totalPrice: this.state.singleBotellaPrice * this.refs.cocoaQuantity.quantity, cocoaQuantity: this.refs.cocoaQuantity.quantity});
      this.setState({domicilio: false, subscription: false});
    }

    @autobind
    updateSaboresQuantity() {
      var sabores = [];
      var cantidades = [];
      console.log("here boii");

      if (this.props.store.cocoaQuantity > 0) {
        sabores.push("COCOA COMPLETA");
        cantidades.push(this.props.store.cocoaQuantity);
      }
      if (this.props.store.chaiQuantity > 0) {
        sabores.push("CHAI COMPLETA");
        cantidades.push(this.props.store.chaiQuantity);
      }
      if (this.props.store.frutosQuantity > 0) {
        sabores.push("FRUTOS COMPLETA");
        cantidades.push(this.props.store.frutosQuantity);
      }
      if (this.props.store.mixtoQuantity > 0) {
        sabores.push("MIXTO COMPLETA");
        cantidades.push(this.props.store.mixtoQuantity);
      }

      if (this.props.store.cocoaSnackQuantity > 0) {
        sabores.push("COCOA SNACK");
        cantidades.push(this.props.store.cocoaSnackQuantity);
      }
      if (this.props.store.chaiSnackQuantity > 0) {
        sabores.push("CHAI SNACK");
        cantidades.push(this.props.store.chaiSnackQuantity);
      }
      if (this.props.store.frutosSnackQuantity > 0) {
        sabores.push("FRUTOS SNACK");
        cantidades.push(this.props.store.frutosSnackQuantity);
      }
      if (this.props.store.mixtoSnackQuantity > 0) {
        sabores.push("MIXTO SNACK");
        cantidades.push(this.props.store.mixtoSnackQuantity);
      }

      console.log("here's all of them: ", sabores, cantidades)

      this.setState({sabores: sabores, cantidades: cantidades});
    }

    @autobind
    dismissCreditCardModal(last4) {
      this.setState({isCreditCardModalOpen: false, credit_last4: last4});
      if (last4 != undefined && last4.length > 1) {
        setTimeout(() => {this.setState({isCheckoutOpen: true});}, 410);
      }
    }

    @autobind
    dismissAddressModal(last4, finished, direccionCompleta, direccionObject) {
      this.setState({isAddressModalOpen: false});
      console.log("the direccionobject: ", direccionObject);
      this.setState({direccionCompleta: direccionCompleta, direccionObject: direccionObject});
      if (last4 != null && last4.length > 1) {
        this.setState({credit_last4: last4});
      }

      if (finished) {
        setTimeout(() => {this.setState({isCheckoutOpen: true});}, 410);
      } else {
        console.log("still needs to add address");
      }
    }

    @autobind
    dismissMapaModal() {
      this.setState({isMapaOpen: false});
    }

    @autobind
    dismissModal() {
      this.props.store.mixtoSnackQuantity = 0;
      this.props.store.mixtoQuantity = 0;
      this.calculateTotalPrice();
      this.props.onClosing(false);
      //this.setState({isOpen: false});
    }

    @autobind
    async continuar(): Promise<void>{
        this.setState({loading: true});
        var user = Firebase.auth.currentUser;

        if (user == null) {
          console.log("error, no usuario");
          return;
        }

        this.updateSaboresQuantity();

        if (this.state.domicilio || this.state.subscription) {
          // check whether we already have his address saved.
          const docRef = await Firebase.firestore.collection("addresses").doc(user.uid);
          var docExists = false;
          var fullAddress = "";
          var direccionObject = undefined;
          await docRef.get().then(function(doc) {
              if (doc.exists) {
                  docExists = true;
                  fullAddress = doc.data().direccionCompleta;
                  direccionObject = doc.data().direccionObject;
              } else {
                  console.log("No such document!");
              }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });

          this.setState({loading: false});
          if (!docExists) {
            //console.log("entoncesss ");
            //this.refs.modal.open();
            this.setState({isAddressModalOpen: true});
            //this.setState({isCheckoutOpen: true});
            return;
          } else {
            this.setState({direccionCompleta: fullAddress, direccionObject: direccionObject});
          }
        }

        // check whether we already have his credit card details.
        const docRef = await Firebase.firestore.collection("paymentInfos").doc(user.uid);
        var docExists = false;
        var last4 = "";
        await docRef.get().then(function(doc) {
            if (doc.exists) {
                docExists = true;
                var tarjetas = doc.data().tarjetas;
                for (var i = 0; i < tarjetas.length; i++) {
                  if (tarjetas[i].usando) {
                    last4 = tarjetas[i].last4;
                  }
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        this.props.store.last4CreditCard = last4;
        this.setState({loading: false});
        if (!docExists) {
          this.setState({isCreditCardModalOpen: true});
          return;
        } else {
          this.setState({credit_last4: last4});
        }

        if (this.state.userActiveSubscription == undefined) {
          this.setState({isCheckoutOpen: true});
          return;
        }

        if (this.state.userActiveSubscription.length > 1) {
          console.log("ACTIVE SUBSCC?? ", this.state.userActiveSubscription);
          if (this.state.subscription ) {
              Alert.alert("Esta nueva subscripción reemplazará tu subscripción actual", "",
              [{text: 'Cancelar', onPress: () => console.log("cancelo")},
              {text: 'Continuar', onPress: () => this.setState({isCheckoutOpen: true})}])
              return;
            }
        }

        this.setState({isCheckoutOpen: true});
    }

    @autobind
    totalPriceChange(change, flavor) {
      console.log("HERE'S THE CHANGE: ", change);
      //change = change.toFixed(2)
      var newTotalPrice = this.state.totalPrice + change;
      newTotalPrice = parseFloat(newTotalPrice.toFixed(2))
      this.setState({totalPrice: newTotalPrice, cocoaQuantity: this.refs.cocoaQuantity.quantity});
      console.log("HERE'S THE NEW TOTAL PRICE: ", newTotalPrice);
      switch (flavor) {
        case "cocoa":
          this.props.store.cocoaQuantity = this.refs.cocoaQuantity.quantity;
          break;
        case "chai":
          this.props.store.chaiQuantity = this.refs.chaiQuantity.quantity;
          break;
        case "frutos":
          this.props.store.frutosQuantity = this.refs.frutosQuantity.quantity;
          break;
        case "mixto":
          this.props.store.mixtoQuantity = this.refs.mixtoQuantity.quantity;
          break;
        case "cocoaSnack":
          this.props.store.cocoaSnackQuantity = this.refs.cocoaSnackQuantity.quantity;
          break;
        case "chaiSnack":
          this.props.store.chaiSnackQuantity = this.refs.chaiSnackQuantity.quantity;
          break;
        case "frutosSnack":
          this.props.store.frutosSnackQuantity = this.refs.frutosSnackQuantity.quantity;
          break;
        case "mixtoSnack":
          this.props.store.mixtoSnackQuantity = this.refs.mixtoSnackQuantity.quantity;
          break;
        default:
          console.log("WTF BROOOO  ", flavor);
      }

      //this.props.store.cocoaQuantity = this.refs.cocoaQuantity.quantity;
      //this.setState({totalPrice: newTotalPrice, cocoaQuantity: this.refs.cocoaQuantity.quantity});
    }

    @autobind
    madeFinalPurchase(compra) {
      console.log("dismissing comprar");
        //this.dismissModal();
      this.props.store.mixtoSnackQuantity = 0;
      this.props.store.mixtoQuantity = 0;
      this.calculateTotalPrice();
      this.props.onClosing(true);
    }

    @autobind
    onConfirmationOpenChange(value) {
      this.setState({isCheckoutOpen: value});
    }

    @autobind
    showIngredients() {
      this.refs.infoNutrimentalModal.open();
    }

    @autobind
    showMap() {
      //this.refs.mapa.open();
      this.setState({isMapaOpen: true});
    }

    @autobind
    onOpened() {
      console.log("running rep update");
      this.updateRepStatus();
      this.updateUserHasSubscription();
      this.calculateTotalPrice();
    }

    static navigationOptions = {
      title: 'Welcome',
    };

    render(): React.Node {
        const today = Moment();

        var descriptionTexto = "  (Total: $" + this.state.totalPrice;
        var descEntrega = "";
        if (this.state.subscription) {
          descriptionTexto += " mensual";
          descEntrega += "¡Despreocúpate y ocúpate!\n\n"
          descEntrega += "La entrega a domicilio por suscripción se hará mensualmente en las fechas establecidas a continuación.\n\n"
        }
        descriptionTexto += ")";
        Moment.updateLocale('es', localization);
        var fechaMin = Moment().add(5, 'days').format("dddd, D MMMM");
        var fechaMax = Moment().add(11, 'days').format("dddd, D MMMM");
        descEntrega += "Entrega en 5 a 11 días: entre " + fechaMin + " y " + fechaMax + ".";
        var recojoText = "Yo Lo Recojo";
        return <Modal style={[style.modal, style.modal2]} isOpen={this.props.isModalOpen} onOpened={this.onOpened} swipeToClose={false}  backdrop={false} coverScreen={Platform.OS === 'android'} position={"top"} ref={"modal2"}>
            <Container>
              <Header style={{backgroundColor: variables.brandInfo, borderBottomWidth: 1, borderColor: variables.lightGray}}>
                <Left>
                    <Button transparent onPress={this.dismissModal}>
                        <Icon name="ios-close-outline" style={{color: variables.brandPrimary}} />
                    </Button>
                </Left>
                <Body>
                    <Title style={{color: variables.brandPrimary}}>COMPRAR</Title>
                </Body>
                <Right>
                 { /*
                   Para cuando se necesite escanear cupones
                   <Button transparent onPress={() => this.refs.couponModal.open()}>
                     <Icon name="md-qr-scanner" style={{color: variables.brandPrimary}} />
                   </Button>
                   */
                 }
                 <View/>
                </Right>
              </Header>
              <View style={{backgroundColor: 'white'}}>
                <Segment style={{backgroundColor: 'white'}}>
                  <Button first active={this.state.domicilio} onPress={this.toggleDomicilioYes}>
                    <Text style={{fontSize: 15}}>Entrega A Domicilio</Text>
                  </Button>
                  <Button last active={!this.state.domicilio} onPress={this.toggleDomicilioNo}>
                    <Text style={{fontSize: 15}}>{recojoText}</Text>
                  </Button>
                </Segment>
              </View>
              <Content>
                <ImageBackground source={Images.cocoaCompleta} style={style.saborImg}>
                  <View style={[Styles.center, style.quantityView]}>
                    <QuantityInput totalPriceChange={this.totalPriceChange} singleBotellaPrice={this.props.store.esRep ? Constants.PRECIO_BOTELLA_REP : Constants.PRECIO_BOTELLA} defaultQuantity={this.props.store.cocoaQuantity} defaultIncrement={this.state.defaultIncrement} ref="cocoaQuantity" flavor="cocoa" singular="botella" plural="botellas" from={0} to={60*this.state.singleBotellaPrice} />
                  </View>
                </ImageBackground>
                <ImageBackground source={Images.chaiCompleta} style={style.saborImg}>
                  <View style={[Styles.center, style.quantityView]}>
                    <QuantityInput totalPriceChange={this.totalPriceChange} singleBotellaPrice={this.props.store.esRep ? Constants.PRECIO_BOTELLA_REP : Constants.PRECIO_BOTELLA} defaultQuantity={this.props.store.chaiQuantity} defaultIncrement={this.state.defaultIncrement} ref="chaiQuantity" flavor="chai" singular="botella" plural="botellas" from={0} to={60*this.state.singleBotellaPrice} />
                  </View>
                </ImageBackground>
                <ImageBackground source={Images.frutosCompleta} style={style.saborImg}>
                  <View style={[Styles.center, style.quantityView]}>
                    <QuantityInput totalPriceChange={this.totalPriceChange} singleBotellaPrice={this.props.store.esRep ? Constants.PRECIO_BOTELLA_REP : Constants.PRECIO_BOTELLA} defaultQuantity={this.props.store.frutosQuantity} defaultIncrement={this.state.defaultIncrement} ref="frutosQuantity" flavor="frutos" singular="botella" plural="botellas" from={0} to={60*this.state.singleBotellaPrice} />
                  </View>
                </ImageBackground>
                {this.state.domicilio ?
                  (<ImageBackground source={Images.mixtoCompleta} style={style.saborImg}>
                    <View style={[Styles.center, style.quantityView]}>
                      <QuantityInput totalPriceChange={this.totalPriceChange} singleBotellaPrice={this.props.store.esRep ? Constants.PRECIO_BOTELLA_REP : Constants.PRECIO_BOTELLA} defaultQuantity={this.props.store.mixtoQuantity} defaultIncrement={this.state.defaultIncrement} ref="mixtoQuantity" flavor="mixto" singular="botella" plural="botellas" from={0} to={60*this.state.singleBotellaPrice} />
                    </View>
                  </ImageBackground>) : null
                }

                <ImageBackground source={Images.cocoaSnack} style={style.saborImg}>
                  <View style={[Styles.center, style.quantityView]}>
                    <QuantityInput totalPriceChange={this.totalPriceChange} singleBotellaPrice={this.props.store.esRep ? Constants.PRECIO_SNACK_REP : Constants.PRECIO_SNACK} defaultQuantity={this.props.store.cocoaSnackQuantity} defaultIncrement={this.state.defaultIncrement} ref="cocoaSnackQuantity" flavor="cocoaSnack" singular="botella" plural="botellas" from={0} to={60*this.state.singleBotellaPrice} />
                  </View>
                </ImageBackground>
                <ImageBackground source={Images.chaiSnack} style={style.saborImg}>
                  <View style={[Styles.center, style.quantityView]}>
                    <QuantityInput totalPriceChange={this.totalPriceChange} singleBotellaPrice={this.props.store.esRep ? Constants.PRECIO_SNACK_REP : Constants.PRECIO_SNACK} defaultQuantity={this.props.store.chaiSnackQuantity} defaultIncrement={this.state.defaultIncrement} ref="chaiSnackQuantity" flavor="chaiSnack" singular="botella" plural="botellas" from={0} to={60*this.state.singleBotellaPrice} />
                  </View>
                </ImageBackground>
                <ImageBackground source={Images.frutosSnack} style={style.saborImg}>
                  <View style={[Styles.center, style.quantityView]}>
                    <QuantityInput totalPriceChange={this.totalPriceChange} singleBotellaPrice={this.props.store.esRep ? Constants.PRECIO_SNACK_REP : Constants.PRECIO_SNACK} defaultQuantity={this.props.store.frutosSnackQuantity} defaultIncrement={this.state.defaultIncrement} ref="frutosSnackQuantity" flavor="frutosSnack" singular="botella" plural="botellas" from={0} to={60*this.state.singleBotellaPrice} />
                  </View>
                </ImageBackground>

                {this.state.domicilio ?
                  (<ImageBackground source={Images.mixtoSnack} style={style.saborImg}>
                    <View style={[Styles.center, style.quantityView]}>
                      <QuantityInput totalPriceChange={this.totalPriceChange} singleBotellaPrice={this.props.store.esRep ? Constants.PRECIO_SNACK_REP : Constants.PRECIO_SNACK} defaultQuantity={this.props.store.mixtoQuantity} defaultIncrement={this.state.defaultIncrement} ref="mixtoSnackQuantity" flavor="mixtoSnack" singular="botella" plural="botellas" from={0} to={60*this.state.singleBotellaPrice} />
                    </View>
                  </ImageBackground>) :
                  null
                }


                <View style={[style.count, style.information]}>
                  <Text onPress={this.showIngredients} style={{color: variables.brandPrimary}}>ⓘ Información Nutricional</Text>
                </View>
                {
                  !this.state.domicilio ? (
                    <View style={[style.count, style.information]}>
                      <Text onPress={this.showMap} style={{color: variables.brandPrimary}}>Ver Mapa de Ubicaciones ONEFOOD</Text>
                    </View>
                  ) :
                  (
                    <View>
                    <List horizontal style={[style.bottomSeparator, {flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingBottom: 20, alignItems: 'flex-start'}]}>
                      <ListItem onPress={this.toggleSubscriptionNo} style={{borderBottomWidth: 0}}>
                        <Text>Compra única</Text>
                        <Right style={{marginLeft: 20}}>
                          <CheckBox style={{backgroundColor: !this.state.subscription ? variables.brandPrimary : variables.lightGray }} onPress={this.toggleSubscriptionNo} checked={this.state.subscription}/>
                        </Right>
                      </ListItem>
                      <ListItem onPress={this.toggleSubscriptionYes}  style={{borderBottomWidth: 0}}>
                        <Text>Suscripción</Text>
                        <Right style={{marginLeft: 20}}>
                          <CheckBox style={{backgroundColor: !this.state.subscription ? variables.lightGray : variables.brandPrimary }} onPress={this.toggleSubscriptionYes} checked={!this.state.subscription} />
                        </Right>
                      </ListItem>
                    </List>
                    <View style={{justifyContent: 'space-around', marginTop: 20, paddingBottom: 20, marginHorizontal: 15, alignItems: 'center'}}>
                      <Text style={{color: variables.darkGray}}>{descEntrega}</Text>
                    </View>
                    </View>
                  )
                }
              </Content>
              <Footer>
                <Button block onPress={this.continuar} disabled={this.state.totalPrice == 0} style={{ height: variables.footerHeight * 1.3, width: width, paddingBottom: 10}}>
                  <ActivityIndicator size="small" color="white" style={{left: -15, marginRight: 5, position: "relative"}} animating={this.state.loading} />
                  <Text style={{color: 'white'}}>CONTINUAR</Text>
                  <Text style={{color: 'white'}}>{descriptionTexto}</Text>
                </Button>
              </Footer>
            </Container>
            <InformacionNutrimental ref={"infoNutrimentalModal"} />
            <MapaAdicional ref={"mapa"} isOpen={this.state.isMapaOpen} dismissModal={this.dismissMapaModal}/>
            <Address isOpen={this.state.isAddressModalOpen} dismissModal={this.dismissAddressModal} ></Address>
            <ScanCoupon ref={"couponModal"}/>
            <CreditCard isOpen={this.state.isCreditCardModalOpen} dismissModal={this.dismissCreditCardModal} ref={"creditCardModal"}></CreditCard>
            <CheckoutConfirmation isCheckoutOpen={this.state.isCheckoutOpen} sabores={this.state.sabores} cantidades={this.state.cantidades} onOpenChange={this.onConfirmationOpenChange} madeFinalPurchase={this.madeFinalPurchase} userActiveSubscription={this.state.userActiveSubscription} domicilio={this.state.domicilio} subscription={this.state.subscription} totalPrice={this.state.totalPrice} cocoaQuantity={this.props.store.cocoaQuantity} lastFour={this.state.credit_last4} direccionCompleta={this.state.direccionCompleta} direccionObject={this.state.direccionObject} ref={"checkoutModal"}></CheckoutConfirmation>
        </Modal>;
    }
}

class DetallesScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.name,
  });
  render() {
    const { goBack } = this.props.navigation;
    return (
      <Button
        title="Go back"
        onPress={() => goBack()}
      />
    );
  }
}

class InformacionNutrimental extends React.Component {
    state = {
      detailModalIsOpen: false,
    }

    open() {
      StatusBar.setBarStyle('light-content', true);
      this.setState({detailModalIsOpen: true});
    }

    @autobind
    setModalStateClosed() {
      this.setState({detailModalIsOpen: false});
    }

    @autobind
    dismissModal() {
      StatusBar.setBarStyle('default', true);
      this.setState({detailModalIsOpen: false});
      //this.props.onModalClose();
    }

    render(): React.Node {
      const {pedidoInfo, pedidoValido} = this.props;

      return <Modal style={style.modal} swipeToClose={false} onClosed={this.setModalStateClosed} isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
                <Swiper loop={false} showsButtons={true} nextButton={<Text style={{color: "white", fontSize: 58}}>›</Text>} prevButton={<Text style={{color: "white", fontSize: 58}}>‹</Text>} activeDotColor={"white"}>
                  <Image source={Images.ingredientes} style={style.infoImg} />
                  <Image source={Images.tablaNutricional} style={style.infoImg} />
                </Swiper>
                <Button style={{position: 'absolute', top: 20, left: 10}} transparent onPress={this.dismissModal}>
                    <Icon name="ios-close-outline" style={style.closeIcon} />
                </Button>
        </Modal>;
    }
}

@inject('store') @observer
class MapaAdicional extends React.Component {

  state = {
    detailModalIsOpen: false,
  }

  open() {
    //StatusBar.setBarStyle('light-content', true);
    this.setState({detailModalIsOpen: true});
  }

  @autobind
  setModalStateClosed() {
    this.setState({detailModalIsOpen: false});
    this.props.dismissModal();
  }

  @autobind
  dismissModal() {
    //StatusBar.setBarStyle('default', true);
    this.props.dismissModal();
    //this.setState({detailModalIsOpen: false});
  }

  render(): React.Node {
    var textoLocacion = "Pasa por tu ONEFOOD a la locación más cercana.";
    const { width, height } = Dimensions.get('window');
    const ratio = width / height;
    var lat = 19.4171;
    var lng = -99.1335;
    const coordinates = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922 * ratio,
    };

    return <Modal style={style.modalMapa} swipeToClose={false} isOpen={this.props.isOpen} onClosed={this.setModalStateClosed} backdrop={true} position={"bottom"} entry={"bottom"} coverScreen={false} ref={"modal"}>
            <Card style={{height: 40}}>
               <Body>
                 <Text style={{color: 'gray'}}>{textoLocacion}</Text>
               </Body>
           </Card>
           <MapaComponent principal={false}/>
      </Modal>;
  }
}

const ComprarRouter = StackRouter({
  Comprar: {screen: Comprar},
  Detalles: {screen: DetallesScreen},
}, {
  initialRouteName: 'Comprar',
});

/*<ImageSlider images={[
     Images.music,
     Images.travel
 ]}/>*/

const {width, windowHeight} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 600 / 750,
        resizeMode: "cover",
        marginBottom: 7,
    },
    saborImg: {
        width,
        height: width * 461/750,
        position: "relative",
    },
    quantityView: {
      top: 85,
      left: 60,
      position: "relative",
    },
    infoImg: {
      flex: 1,
      height: windowHeight,
      width: width,
      justifyContent: 'center',
      resizeMode: 'contain',
    },
    infoImgOld: {
      flex: 1,
      width: width - 60,
      left: 30,
      justifyContent: 'center',
      height: windowHeight - 60,
      resizeMode: 'contain',
      top: -20,
    },
    bottomSeparator: {
      borderBottomWidth: variables.borderWidth,
      borderColor: variables.listBorderColor,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    information: {
       flexDirection: 'row',
       flex: 1,
       justifyContent: 'space-around',
    },
    closeIcon: {
        fontSize: 60,
        marginLeft: 20,
        color: "white"
    },
    row: {
        flex: 1,
        flexDirection: "row",
        borderColor: variables.listBorderColor,
        borderBottomWidth: variables.borderWidth,
        alignItems: 'center',
    },
    column: {
      flex: 1,
      flexDirection: "column",
      borderColor: variables.listBorderColor,
      borderBottomWidth: variables.borderWidth
    },
    itemContainer: {
        flex: 1
    },
    priceContainer: {
        flexDirection: "row",
        borderTopWidth: variables.borderWidth,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    leftCell: {
        borderRightWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    checkBox: {
      backgroundColor: variables.lightGray,
    },
    count: {
        flex: 1,
        padding: variables.contentPadding * 2,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
    },
    heading: {
        color: variables.darkGray,//'#9c5d30',
    },
    modalMapa: {
      height: 400,
      flexDirection: "row",
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal2: {
      backgroundColor: variables.brandInfo
    },
    map: {
       position: 'absolute',
       top: 0,
       left: 0,
       right: 0,
       bottom: 0,
       zIndex: -1,
     }
});
