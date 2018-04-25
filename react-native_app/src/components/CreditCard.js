// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {CreditCardInput, LiteCreditCardInput, CardView} from "react-native-credit-card-input";
import {View, Image, StyleSheet, Dimensions, ScrollView, ActivityIndicator} from "react-native";
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
    }

    componentWillMount() {
      this.setState({shouldUpdate: true});
    }
    componentDidMount() {
    }

    componentWillUnmount() {
      this.setState({shouldUpdate: false});
    }

    open() {
      this.setState({isOpen: true});
    }

    @autobind
    async guardarTarjeta(): Promise<void> {
      // guardar credit card details
      this.setState({loading: true});
      var user = Firebase.auth.currentUser;

      var paymentInfo = {
        user_id: user.uid,
        last_four: this.state.last_four,
      }

      await Firebase.firestore.collection("paymentInfos").doc(user.uid).set(paymentInfo)
      .then(function() {
          console.log("Document written");
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });

      this.setState({loading: false});
      this.dismissModal();
    }

    @autobind
    dismissModal(){
      this.setState({isOpen: false});
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

    }

    render(): React.Node {

        return <Modal style={[style.modal]} isOpen={this.state.isOpen} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"} ref={"modal2"}>
                <Container safe={true}>
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
                    <CreditCardInput ref="CCInput" onChange={this.paymentOnChange} autoFocus={true} labelStyle={style.whiteStyle} inputStyle={style.whiteStyle}/>
                  </Content>
                  <ActivityIndicator size="large" animating={this.state.loading}/>
                  <Button primary block onPress={this.guardarTarjeta} style={{ height: variables.footerHeight * 1.3 }}>
                    <Text style={{color: 'white'}}>GUARDAR</Text>
                  </Button>
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
