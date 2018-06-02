// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, InteractionManager, Animated, ScrollView, ActivityIndicator, SafeAreaView, StatusBar} from "react-native";
import {H1, Text, Button, Segment, Radio, List, ListItem, Right, Content, CheckBox, Container, Header, Left, Icon, Title, Body, Footer} from "native-base";
import ImageSlider from 'react-native-image-slider';
import {TaskOverview, Images, Styles, PrecioTotal, QuantityInput, ScanCoupon, Address, Firebase, CreditCard, CheckoutConfirmation, WindowDimensions} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import {StackNavigator, StackRouter} from 'react-navigation';
import {action, observable} from "mobx";
import { observer, inject } from "mobx-react/native";
import PedidoModel from "../components/APIStore";
import Swiper from "react-native-swiper";
import * as Constants from '../Constants';
import variables from "../../native-base-theme/variables/commonColor";
import openMap from 'react-native-open-maps';
import MapView, {Marker} from "react-native-maps";

@inject('store') @observer
export default class Comprar extends React.Component {
    static router = ComprarRouter;

    state = {
      subscription: false,
      domicilio: false,
      isOpen: false,
      totalPrice: Constants.PRECIO_BOTELLA,
      cocoaQuantity: 1,
      credit_last4: "0000",
      isCheckoutOpen: false,
      loading: false,
      direccionCompleta: "",
      isCreditCardModalOpen: false,
      isAddressModalOpen: false,
    }

    componentDidMount() {
      this.setState({totalPrice: Constants.PRECIO_BOTELLA});
    }

    @autobind @action
    open() {
      this.setState({totalPrice: Constants.PRECIO_BOTELLA});
      this.setState({isOpen: true});
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
      if (this.refs.cocoaQuantity.quantity != 0) {
        var prevcocoa = this.refs.cocoaQuantity.quantity;
        var cocoaDifference = (6 - prevcocoa)*Constants.PRECIO_BOTELLA;
        this.refs.cocoaQuantity.quantity = 6;
        currentPrice = this.state.totalPrice + cocoaDifference;
        this.setState({totalPrice: currentPrice});
      }
      this.refs.cocoaQuantity.incrementAmount = 6;

      this.setState({domicilio: true});
    }

    @autobind @action
    toggleDomicilioNo() {
      this.refs.cocoaQuantity.incrementAmount = 1;
      this.setState({domicilio: false});
    }

    @autobind
    dismissCreditCardModal(last4) {
      this.setState({isCreditCardModalOpen: false, credit_last4: last4});
      setTimeout(() => {this.setState({isCheckoutOpen: true});}, 410);
    }

    @autobind
    dismissAddressModal() {
      this.setState({isAddressModalOpen: false});
      setTimeout(() => {this.setState({isCheckoutOpen: true});}, 410);
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
          await docRef.get().then(function(doc) {
              if (doc.exists) {
                  docExists = true;
                  console.log("Doc exists!!  data:", doc.data());
                  fullAddress = doc.data().direccionCompleta;
              } else {
                  console.log("No such document!");
              }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });

          this.setState({loading: false});

          console.log("aqui con la direccion existe? ", docExists);
          if (!docExists) {
            //console.log("entoncesss ");
            //this.refs.modal.open();
            this.setState({isAddressModalOpen: true});
            //this.setState({isCheckoutOpen: true});
            return;
          } else {
            this.setState({direccionCompleta: fullAddress});
          }
        }

        // check whether we already have his credit card details.
        const docRef = await Firebase.firestore.collection("paymentInfos").doc(user.uid);
        var docExists = false;
        var last4 = "";
        await docRef.get().then(function(doc) {
            if (doc.exists) {
                docExists = true;
                console.log("Doc exists!!  data:", doc.data());
                var tarjetas = doc.data().tarjetas;
                for (var i = 0; i < tarjetas.length; i++) {
                  console.log("por aqui ", tarjetas[i]);
                  if (tarjetas[i].usando) {
                    last4 = tarjetas[i].last4;
                  }
                }
                console.log("indiegogo ", last4);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        this.props.store.last4CreditCard = last4;

        this.setState({loading: false});
        console.log("tarjeta existe? ", docExists);
        if (!docExists) {
          console.log("y entonces");
          this.setState({isCreditCardModalOpen: true});
          return;
        } else {
          this.setState({credit_last4: last4});
        }

        console.log("state of the union senor ", this.state.credit_last4);
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
      this.refs.mapa.open();
    }

    static navigationOptions = {
      title: 'Welcome',
    };

    render(): React.Node {
        const today = moment();

        var descriptionTexto = "(Total: $" + this.state.totalPrice;

        if (this.state.subscription) {
          descriptionTexto += " mensual";
        }
        descriptionTexto += ")";

        return <Modal style={[style.modal, style.modal2]} isOpen={this.props.isModalOpen} swipeToClose={false}  backdrop={false} position={"top"} ref={"modal2"}>
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
              <Segment>
                <Button first active={this.state.domicilio} onPress={this.toggleDomicilioYes}>
                  <Text>Entrega A Domicilio</Text>
                </Button>
                <Button last active={!this.state.domicilio} onPress={this.toggleDomicilioNo}>
                  <Text>Recoger Producto</Text>
                </Button>
              </Segment>
                <Image source={Images.botellaNaranja} style={style.img} />
                <View style={[style.count, style.information]}>
                  <Text onPress={this.showIngredients} style={{color: variables.brandPrimary}}>ⓘ Información Nutricional</Text>
                </View>
                <ActivityIndicator size="large" animating={this.state.loading}/>
                <View style={[style.count, Styles.center]}>
                    <H1 style={style.heading}>COCOA</H1>
                    <Text style={{color: 'gray'}}>SABOR</Text>
                    <QuantityInput totalPriceChange={this.totalPriceChange} ref="cocoaQuantity" singular="botella" plural="botellas" from={0} to={24*Constants.PRECIO_BOTELLA} />
                </View>
                {
                  !this.state.domicilio ? (
                    <View style={[style.count, style.information]}>
                      <Text onPress={this.showMap} style={{color: variables.brandPrimary}}>Ver Mapa de Ubicaciones ONEFOOD</Text>
                    </View>
                  ) :
                  (
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
                  )
                }
              </Content>
              <Button block onPress={this.continuar} disabled={this.state.totalPrice == 0} style={{ height: variables.footerHeight * 1.3 }}>
                <Text style={{color: 'white'}}>CONTINUAR</Text>
                <Text style={{color: 'white'}}>  {descriptionTexto} </Text>
              </Button>
            </Container>
            <InformacionNutrimental ref={"infoNutrimentalModal"} />
            <MapaAdicional ref={"mapa"} />
            <Address isOpen={this.state.isAddressModalOpen} dismissModal={this.dismissAddressModal} ></Address>
            <ScanCoupon ref={"couponModal"}/>
            <CreditCard isOpen={this.state.isCreditCardModalOpen} dismissModal={this.dismissCreditCardModal} ref={"creditCardModal"}></CreditCard>
            <CheckoutConfirmation isCheckoutOpen={this.state.isCheckoutOpen} onOpenChange={this.onConfirmationOpenChange} madeFinalPurchase={this.madeFinalPurchase} domicilio={this.state.domicilio} subscription={this.state.subscription} totalPrice={this.state.totalPrice} cocoaQuantity={this.state.cocoaQuantity} lastFour={this.state.credit_last4} direccionCompleta={this.state.direccionCompleta} ref={"checkoutModal"}></CheckoutConfirmation>
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

let markerId = 0;

class MapaAdicional extends React.Component {

  state = {
    detailModalIsOpen: false,
    markers: [{key: markerId++, title: "Camión ONEFOOD #23", description: "Presiona para abrir en Mapa.", coordinate: {latitude: 19.4326, longitude: -99.1335}, color: "green"},
              {key: markerId++, title: "Camión ONEFOOD #2", description: "Presiona para abrir en Mapa.", coordinate: {latitude: 19.4452, longitude: -99.1359}, color: "green"}
              ],
  }

  open() {
    StatusBar.setBarStyle('light-content', true);
    this.setState({detailModalIsOpen: true});
  }

  @autobind
  openMapMarker(coordinate) {
    openMap({latitude: coordinate.latitude, longitude: coordinate.longitude});
  }

  @autobind
  setModalStateClosed() {
    this.setState({detailModalIsOpen: false});
  }

  @autobind
  dismissModal() {
    StatusBar.setBarStyle('default', true);
    this.setState({detailModalIsOpen: false});
  }

  render(): React.Node {
    const {pedidoInfo, pedidoValido} = this.props;
    const { width, height } = Dimensions.get('window');
    const ratio = width / height;
    const coordinates = {
      latitude: 19.4326,
      longitude: -99.1332,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922 * ratio,
    };

    return <Modal style={style.modal} swipeToClose={false} onClosed={this.setModalStateClosed} isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
            <MapView
                  style={style.map}
                  initialRegion={coordinates}>
                  {this.state.markers.map(marker => (
                     <Marker
                       key={marker.key}
                       title={marker.title}
                       description={marker.description}
                       coordinate={marker.coordinate}
                       pinColor={marker.color}
                       onCalloutPress={() => this.openMapMarker(marker.coordinate)}
                     />
                   ))}
                 </MapView>
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
    modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal2: {
    backgroundColor: variables.brandInfo
  },
  map: {
     position: 'absolute',
     top: 20,
     left: 0,
     right: 0,
     bottom: 0,
     zIndex: -1,
   }
});
