// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, InteractionManager, Platform, Animated, ScrollView, ActivityIndicator, SafeAreaView, StatusBar, Alert} from "react-native";
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
      cocoaQuantity: 1,
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
      userActiveSubscription: "",
    }

    componentDidMount() {
      this.setState({totalPrice: Constants.PRECIO_BOTELLA});
      this.props.store.totalPrice = Constants.PRECIO_BOTELLA * this.state.defaultQuantity; // this.refs.cocoaQuantity.quantity;
      this.props.store.cocoaQuantity = this.state.defaultQuantity;
      // this.refs.cocoaQuantity.quantity = this.state.defaultQuantity;
      // if (this.state.domicilio) {
      //   this.updateMinimumToDomicilio();
      // }
    }

    @autobind @action
    open() {
      // this.setState({totalPrice: Constants.PRECIO_BOTELLA});
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
      this.updateMinimumToDomicilio();

      this.setState({domicilio: true});
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
      if (this.refs.cocoaQuantity.quantity != 0 && this.refs.cocoaQuantity.quantity % 6 != 0) {
        //var prevcocoa = this.refs.cocoaQuantity.quantity;
        //var cocoaDifference = (6 - prevcocoa)*Constants.PRECIO_BOTELLA;
        var minimumQuantity = 6;
        this.refs.cocoaQuantity.quantity = minimumQuantity;
        //currentPrice = this.state.totalPrice + cocoaDifference;
        this.setState({totalPrice: Constants.PRECIO_BOTELLA * minimumQuantity, cocoaQuantity: minimumQuantity});
        this.props.store.totalPrice = Constants.PRECIO_BOTELLA * minimumQuantity;
        this.props.store.cocoaQuantity = minimumQuantity;
        this.setState({defaultQuantity: 6});
      }
      this.refs.cocoaQuantity.incrementAmount = 6;
      this.setState({defaultIncrement: 6});
    }

    @autobind @action
    toggleDomicilioNo() {
      console.log("HEREE");
      this.refs.cocoaQuantity.incrementAmount = 1;
      this.setState({defaultQuantity: this.refs.cocoaQuantity.quantity, defaultIncrement: 1});
    //  this.setState({totalPrice: Constants.PRECIO_BOTELLA * this.refs.cocoaQuantity.quantity, cocoaQuantity: this.refs.cocoaQuantity.quantity});
      this.setState({domicilio: false, subscription: false});
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
      this.props.onClosing();
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
    totalPriceChange(change) {
      this.setState({totalPrice: this.state.totalPrice + change, cocoaQuantity: this.refs.cocoaQuantity.quantity});
    }

    @autobind
    madeFinalPurchase() {
        this.dismissModal();
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
      this.updateUserHasSubscription();
      this.refs.cocoaQuantity.quantity = this.props.store.cocoaQuantity;
      this.setState({totalPrice: this.props.store.cocoaQuantity * Constants.PRECIO_BOTELLA});
      this.props.store.totalPrice = Constants.PRECIO_BOTELLA * this.refs.cocoaQuantity.quantity;
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
          descEntrega += "La entrega a domicilio por subscripción se hará mensualmente en las fechas establecidas a continuación.\n\n"
        }
        descriptionTexto += ")";
        Moment.updateLocale('es', localization);
        var fechaMin = Moment().add(5, 'days').format("dddd, D MMMM");
        var fechaMax = Moment().add(11, 'days').format("dddd, D MMMM");
        descEntrega += "Entrega en 5 a 11 días: entre " + fechaMin + " y " + fechaMax + ".";

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
                  <Button transparent onPress={() => this.refs.couponModal.open()}>
                    <Icon name="md-qr-scanner" style={{color: variables.brandPrimary}} />
                  </Button>
                </Right>
              </Header>
              <Content>
              <Segment style={{}}>
                <Button first active={this.state.domicilio} onPress={this.toggleDomicilioYes}>
                  <Text style={{fontSize: 13}}>Entrega A Domicilio</Text>
                </Button>
                <Button last active={!this.state.domicilio} onPress={this.toggleDomicilioNo}>
                  <Text style={{fontSize: 13}}>Recoger Producto</Text>
                </Button>
              </Segment>
                <Image source={Images.botellaNaranja} style={style.img} />
                <View style={[style.count, style.information]}>
                  <Text onPress={this.showIngredients} style={{color: variables.brandPrimary}}>ⓘ Información Nutricional</Text>
                </View>
                <View style={[style.information, {marginBottom: -10}]}>
                  <Button disabled={true} style={{backgroundColor: variables.brandInfo}}>
                    <Icon name="arrow-down"/>
                  </Button>
                </View>
                <ActivityIndicator size="large" animating={this.state.loading}/>
                <View style={[style.count, Styles.center]}>
                    <H1 style={style.heading}>COCOA</H1>
                    <Text style={{color: 'gray'}}>SABOR</Text>
                    <QuantityInput totalPriceChange={this.totalPriceChange} defaultQuantity={this.props.store.cocoaQuantity} defaultIncrement={this.state.defaultIncrement} ref="cocoaQuantity" singular="botella" plural="botellas" from={0} to={60*Constants.PRECIO_BOTELLA} />
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
            <CheckoutConfirmation isCheckoutOpen={this.state.isCheckoutOpen} onOpenChange={this.onConfirmationOpenChange} madeFinalPurchase={this.madeFinalPurchase} userActiveSubscription={this.state.userActiveSubscription} domicilio={this.state.domicilio} subscription={this.state.subscription} totalPrice={this.state.totalPrice} cocoaQuantity={this.state.cocoaQuantity} lastFour={this.state.credit_last4} direccionCompleta={this.state.direccionCompleta} direccionObject={this.state.direccionObject} ref={"checkoutModal"}></CheckoutConfirmation>
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
