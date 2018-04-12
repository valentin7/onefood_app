// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, InteractionManager, Animated, ScrollView} from "react-native";
import {H1, Text, Button, Radio, List, ListItem, Right, Content, CheckBox, Container, Header, Left, Icon, Title, Body, Footer} from "native-base";
import ImageSlider from 'react-native-image-slider';
import {TaskOverview, Images, Styles, PrecioTotal, QuantityInput, Address, Firebase, CreditCard, CheckoutConfirmation} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import {StackNavigator, StackRouter} from 'react-navigation';
import {action, observable} from "mobx";
import PedidoModel from "../components/APIStore";

import variables from "../../native-base-theme/variables/commonColor";

export default class Comprar extends React.Component {
    static router = ComprarRouter;

    state = {
      subscription: false,
      domicilio: false,
      isOpen: false,
      totalPrice: 40,
      vanillaQuantity: 1,
      chocolateQuantity: 1,
      credit_last4: "0000",
    }

    @action
    componentWillMount() {
    //  this.setState({totalPrice: this.refs.chocolateQuantity.quantity});

    }

    componentDidMount() {
      console.log("ziwatanejo");
      this.setState({totalPrice: 40});
    }

    open() {
      this.setState({totalPrice: 40});
      this.setState({isOpen: true});
      //this.refs.modal2.open();
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
      if (this.refs.chocolateQuantity.quantity != 0) {
        var prevChocolate = this.refs.chocolateQuantity.quantity;
        var chocolateDifference = (6 - prevChocolate)*20;
        this.refs.chocolateQuantity.quantity = 6;
        currentPrice = this.state.totalPrice + chocolateDifference;
        this.setState({totalPrice: currentPrice});
      }
      this.refs.chocolateQuantity.incrementAmount = 6;

      if (this.refs.vanillaQuantity.quantity != 0) {
        var prevVanilla= this.refs.vanillaQuantity.quantity;
        var vanillaDifference = (6 - prevVanilla)*20;
        this.refs.vanillaQuantity.quantity = 6;
        this.setState({totalPrice: currentPrice + vanillaDifference});
      }
      this.refs.vanillaQuantity.incrementAmount = 6;

      this.setState({domicilio: true});
    }

    @autobind @action
    toggleDomicilioNo() {
      this.refs.chocolateQuantity.incrementAmount = 1;
      this.refs.vanillaQuantity.incrementAmount = 1;
      this.setState({domicilio: false});
    }

    @autobind
    dismissModal() {
      this.setState({isOpen: false});
    }

    @autobind
    async continuar(): Promise<void>{
        var user = Firebase.auth.currentUser;

        if (user == null) {
          console.log("error, no usuario");
          return;
        }
        // check whether we already have his credit card details.
        if (this.state.domicilio) {
          this.refs.modal.open();
          return;
        }

        // const query = await Firebase.firestore.collection("paymentInfos").where("user_id", "==", user.uid).get().catch(function(error) {
        //     console.log("Error getting documents: ", error);
        // });

        const docRef = await Firebase.firestore.collection("paymentInfos").doc(user.uid);
        var docExists = false;
        var last4 = "";
        await docRef.get().then(function(doc) {
            if (doc.exists) {
                docExists = true;
                console.log("Doc exists!!  data:", doc.data());
                last4 = doc.data().last_four;
                console.log("indiegogo ", last4);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });


        if (!docExists) {
          this.refs.creditCardModal.open();
          return;
        } else {
          this.setState({credit_last4: last4});
        }

        // if (query.data() == 0) {
        //   this.refs.creditCardModal.open();
        //   return;
        // } else {
        //   query.forEach(doc => {
        //   //  console.log("GOT THISSS", doc);
        //
        // }

        console.log("state of the union ", this.state.credit_last4);
        this.refs.checkoutModal.open();
          // this.makePurchase();
          // this.dismissModal();
    }

    @autobind
    totalPriceChange(change) {
      this.setState({totalPrice: this.state.totalPrice + change, vanillaQuantity: this.refs.vanillaQuantity.quantity, chocolateQuantity: this.refs.chocolateQuantity.quantity});
    }

    @autobind
    madeFinalPurchase() {
        this.dismissModal();
    }


    static navigationOptions = {
      title: 'Welcome',
    };

    render(): React.Node {
        const today = moment();

        return <Modal style={[style.modal, style.modal2]} isOpen={this.state.isOpen} swipeToClose={false}  backdrop={false} position={"top"} ref={"modal2"}>
            <Container>
              <Header>
                <Left>
                    <Button transparent onPress={this.dismissModal}>
                        <Icon name="ios-close-outline" style={style.closeIcon} />
                    </Button>
                </Left>
                <Body>
                    <Title>COMPRAR</Title>
                </Body>
                <Right />
              </Header>
              <Content>
                <Image source={Images.music} style={style.img} />
                <View style={[style.count, Styles.center]}>
                    <H1 style={style.heading}>CHOCOLATE</H1>
                    <Text style={Styles.grayText}>SABOR</Text>
                    <QuantityInput totalPriceChange={this.totalPriceChange} ref="chocolateQuantity" singular="botella" plural="botellas" from={0} to={120} />
                </View>
                <View style={[style.count, Styles.center]}>
                    <H1 style={style.heading}>VAINILLA</H1>
                    <Text style={Styles.grayText}>SABOR</Text>
                    <QuantityInput totalPriceChange={this.totalPriceChange} ref="vanillaQuantity" singular="botella" plural="botellas" from={0} to={120} />
                </View>
                <List style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start'}}>
                  <ListItem onPress={this.toggleSubscriptionNo}>
                    <Text>Una Vez</Text>
                    <Right style={{marginLeft: 20}}>
                      <CheckBox onPress={this.toggleSubscriptionNo} checked={!this.state.subscription}/>
                    </Right>
                  </ListItem>
                  <ListItem onPress={this.toggleSubscriptionYes}>
                    <Text>Subscripción Mensual</Text>
                    <Right style={{marginLeft: 20}}>
                      <CheckBox onPress={this.toggleSubscriptionYes} checked={this.state.subscription} />
                    </Right>
                  </ListItem>
                </List>

                <List horizontal style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 5, alignItems: 'flex-start'}}>
                  <ListItem onPress={this.toggleDomicilioYes} >
                    <Text>Entrega a Domicilio</Text>
                    <Right style={{marginLeft: 20}}>
                      <CheckBox onPress={this.toggleDomicilioYes} checked={this.state.domicilio}/>
                    </Right>
                  </ListItem>
                  <ListItem onPress={this.toggleDomicilioNo}>
                    <Text>Me queda de pasada</Text>
                    <Right style={{marginLeft: 20}}>
                      <CheckBox onPress={this.toggleDomicilioNo} checked={!this.state.domicilio} />
                    </Right>
                  </ListItem>
                </List>
              </Content>
              <Button block onPress={this.continuar} style={{ height: variables.footerHeight * 1.3 , backgroundColor: variables.brandSuccess}}>
                <Text>CONTINUAR</Text>
                <Text>  (Total: ${this.state.totalPrice})</Text>
              </Button>
            </Container>
            <Address ref={"modal"}></Address>
            <CreditCard ref={"creditCardModal"}></CreditCard>
            <CheckoutConfirmation madeFinalPurchase={this.madeFinalPurchase} domicilio={this.state.domicilio} subscription={this.state.subscription} totalPrice={this.state.totalPrice} vanillaQuantity={this.state.vanillaQuantity} chocolateQuantity={this.state.chocolateQuantity} lastFour={this.state.credit_last4} ref={"checkoutModal"}></CheckoutConfirmation>
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

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750,
        resizeMode: "cover",
        marginBottom: 7,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    count: {
        flex: .5,
        padding: variables.contentPadding * 2
    },
    heading: {
        color: "white"
    },
    modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal2: {
    backgroundColor: variables.brandInfo
  },
});
