// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {CreditCardInput, LiteCreditCardInput, CardView} from "react-native-credit-card-input";
import {View, Image, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Platform, UIManager} from "react-native";
import {H1, Text, Button, Radio, ListItem, Right, Content, Container, CheckBox, Form, Item, Input, Left, Body, Header, Icon, Title} from "native-base";
import {BaseContainer, Images, Styles, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";

export default class CreditCard extends React.Component {

    state = {
      subscription: false,
      isOpen: false,
      last_four: "0000",
      loading: false,
      tarjetas: [],
      guardoTarjeta: false,
      isGuardarDisabled: true,
    }

    componentWillMount() {
      this.setState({shouldUpdate: true});
      // Enable LayoutAnimation under Android
      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true)
      }
    }
    componentDidMount() {
      this.refreshTarjetas()
    }

    componentWillUnmount() {
      this.setState({shouldUpdate: false});
    }

    open() {
      this.setState({isOpen: true});
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
              console.log("Doc exists!!  data:", doc.data());
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
    async guardarTarjeta(): Promise<void> {
      // guardar credit card details
      this.setState({loading: true});
      var user = Firebase.auth.currentUser;

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

      if (currNumber.length > 4) {
        var last4 = currNumber.slice(-4);
        this.setState({last_four: last4});
      }

      var cvcStatus = info.status.cvc;
      if (cvcStatus == "valid") {
        this.setState({isGuardarDisabled: false});
      }
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
                   <Button disabled={this.state.isGuardarDisabled} primary block onPress={this.guardarTarjeta} style={{ height: variables.footerHeight * 1.3, }}>
                     <Text style={{color: 'white'}}>GUARDAR</Text>
                   </Button>
                  </Content>

                </Container>
        </Modal>;
    }
}

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
  modal: {
    backgroundColor: 'white'
  },
  whiteStyle: {
    color: variables.darkGray
  }
});
