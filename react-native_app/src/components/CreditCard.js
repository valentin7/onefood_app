// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {CreditCardInput, LiteCreditCardInput, CardView} from "react-native-credit-card-input";
import {View, Image, StyleSheet, Dimensions, ScrollView} from "react-native";
import {H1, Text, Button, Radio, ListItem, Right, Content, Container, CheckBox, Form, Item, Input, Left, Body, Header, Icon, Title} from "native-base";
import {BaseContainer, Images, Styles} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";

export default class CreditCard extends React.Component {

    state = {
      subscription: false,
      isOpen: false,
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
    dismissModal() {
      // guardar credit card details
      this.setState({isOpen: false});
    }

    @autobind
    paymentOnChange(info) {
      //this.refs.CCInput.setValues({ number: "4737029071352034" });
    //  console.log(info);
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
                  <Button primary block onPress={this.dismissModal} style={{ height: variables.footerHeight * 1.3 }}>
                    <Text>GUARDAR</Text>
                  </Button>
                </Container>
        </Modal>;
    }
}

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
  modal: {
    backgroundColor: variables.brandInfo
  },
  whiteStyle: {
    color: "white"
  }
});
