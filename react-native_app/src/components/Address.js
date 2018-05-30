// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, InteractionManager, Animated, ScrollView, ActivityIndicator} from "react-native";
import {H1, Text, Button, Radio, ListItem, Right, Content, Container, CheckBox, Form, Item, Input, Left, Body, Header, Icon, Title} from "native-base";
import {BaseContainer, Images, Styles, Firebase, CreditCard} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";

export default class Address extends React.Component {

    state = {
      subscription: false,
      isOpen: false,
      linea1: "",
      linea2: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
      loading: false,
      isCreditCardModalOpen: false,
      credit_last4: "0000",
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
    setLinea1(text) {
      this.setState({linea1: text});
    }

    @autobind
    setLinea2(text) {
      this.setState({linea2: text});
    }

    @autobind
    setCiudad(text) {
      this.setState({ciudad: text});
    }

    @autobind
    setEstado(text) {
      this.setState({estado: text});
    }

    @autobind
    setCodigoPostal(text) {
      this.setState({codigoPostal: text});
    }
    @autobind
    dismissCreditCardModal(last4) {
      this.setState({isCreditCardModalOpen: false, credit_last4: last4});
    }

    @autobind
    async saveAddress(): Promise<void> {
      this.setState({loading: true});
      var user = Firebase.auth.currentUser;

      var fullAddress = "";
      fullAddress += this.state.linea1 + "\n";
      fullAddress += this.state.linea2 + "\n";
      fullAddress += this.state.ciudad + ", " + this.state.estado + ", " + this.state.codigoPostal;

      var addressInfo = {
        user_id: user.uid,
        direccionCompleta: fullAddress,
      }

      await Firebase.firestore.collection("addresses").doc(user.uid).set(addressInfo)
      .then(function() {
          console.log("SAVED ADDRESS written");
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });

      this.setState({loading: false});
      this.dismissModal();
      //this.continuar();
    }

    @autobind
    async continuar(): Promise<void> {
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
    }

    @autobind
    dismissModal() {
      this.setState({isOpen: false});
    }

    render(): React.Node {

        return <Modal style={[style.modal]} isOpen={this.state.isOpen} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"} ref={"modal2"}>
                <Container safe={true}>
                  <Header style={{borderBottomWidth: 1, borderColor: variables.lightGray}}>
                      <Left>
                          <Button transparent onPress={this.dismissModal}>
                              <Icon name="ios-close-outline" style={style.closeIcon} />
                          </Button>
                      </Left>
                      <Body>
                          <Title>DIRECCIÓN</Title>
                      </Body>
                      <Right />
                  </Header>
                  <Content style={style.content}>
                    <Form>
                      <Item>
                        <Input placeholder="Dirección Línea 1" onChangeText={this.setLinea1}/>
                      </Item>
                      <Item>
                        <Input placeholder="Dirección Línea 2"  onChangeText={this.setLinea2}/>
                      </Item>
                      <Item>
                        <Input placeholder="Ciudad"  onChangeText={this.setCiudad}/>
                      </Item>
                      <Item>
                        <Input placeholder="Estado"  onChangeText={this.setEstado}/>
                      </Item>
                      <Item last>
                        <Input placeholder="Código Postal"  onChangeText={this.setCodigoPostal}/>
                      </Item>
                    </Form>
                    <ActivityIndicator size="large" animating={this.state.loading}/>
                  </Content>
                  <Button block onPress={this.saveAddress} style={{ height: variables.footerHeight * 1.3 }}>
                    <Text style={{color: 'white'}}>LISTO</Text>
                  </Button>
                </Container>
                <CreditCard isOpen={this.state.isCreditCardModalOpen} dismissModal={this.dismissCreditCardModal} ref={"creditCardModal"}></CreditCard>
        </Modal>;
    }
}

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    heading: {
        color: "white"
    },
    closeIcon: {
        fontSize: 50,
        color: variables.brandPrimary,
    },
    content: {
      backgroundColor: variables.brandInfo,
    },
    btn: {
      margin: 10,
      backgroundColor: "#3B5998",
      padding: 10
    },
    btnModal: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 50,
      height: 50,
      backgroundColor: "transparent"
    },
    modal: {
    },
});
