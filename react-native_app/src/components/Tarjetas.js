// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, ActivityIndicator} from "react-native";
import {H1, Text, Button, Radio, ListItem, Right, Content, Container, Item, Input, Left, Body, Header, Icon, Title} from "native-base";
import {BaseContainer, Images, Styles, Firebase, CreditCard} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";
import { observer, inject } from "mobx-react/native";

@inject('store') @observer
export default class Tarjetas extends React.Component {

    state = {
      tarjetas: [],
      loading: false,
      isCreditCardModalOpen: false,
    }

    open() {
    }

    @autobind
    setLinea1(text) {
      this.setState({linea1: text});
    }

    componentDidMount() {
      this.refreshTarjetas();
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
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      this.setState({tarjetas: tarjetas});
    }

    @autobind
    async guardarTarjetas(): Promise<void> {
      this.setState({loading: true});
      var user = Firebase.auth.currentUser;
      if (this.state.tarjetas.length < 1) {
        return;
      }
      await Firebase.firestore.collection("paymentInfos").doc(user.uid).set({tarjetas: this.state.tarjetas})
      .then(function() {
          console.log("SAVED TARJETAS");
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });

      this.setState({loading: false});
    }

    @autobind
    usarTarjeta(index) {
      console.log("hey index", index);
      var tarjetas = this.state.tarjetas;
      for (var i = 0; i < tarjetas.length; i++) {
        tarjetas[i].usando = false;
      }
      tarjetas[index].usando = true;
      this.props.store.last4CreditCard = tarjetas[index].last4;

      this.setState({tarjetas: tarjetas});
    }

    @autobind
    removerTarjeta(index) {
      console.log("hey index", index);
      var tarjetas = this.state.tarjetas;
      tarjetas.splice(index, 1);
      this.setState({tarjetas: tarjetas});
    }

    @autobind
    agregarTarjeta() {
      this.guardarTarjetas();
      this.setState({isCreditCardModalOpen: true});
    }

    @autobind
    dismissCreditCardModal() {
      this.refreshTarjetas();
      this.setState({isCreditCardModalOpen: false});
    }

    @autobind
    dismissModal() {
      // save tarjetas.
      this.guardarTarjetas();
      var last4 = "";
      for (var i = 0; i < this.state.tarjetas.length; i++) {
        if (this.state.tarjetas[i].usando) {
          last4 = this.state.tarjetas[i].last4;
        }
      }
      this.props.store.last4CreditCard = last4;
      this.props.dismissTarjetasModal(last4);
      //this.setState({isOpen: false});
    }

    render(): React.Node {
        return <Modal style={[style.modal]} isOpen={this.props.isTarjetasOpen} animationDuration={400} swipeToClose={false} coverScreen={true} backdropPressToClose={false} position={"center"} ref={"modal2"}>
                <Container safe={true}>
                  <Header style={{borderBottomWidth: 1, borderColor: variables.lightGray}}>
                      <Body>
                          <Title>TARJETAS</Title>
                      </Body>
                  </Header>
                  <Content style={style.content}>
                    <ActivityIndicator size="large" animating={this.state.loading}/>
                    {this.state.tarjetas.map((item, key) =>  (
                      <View key={key} style={style.section}>
                        <Icon name="ios-card" style={{ color: variables.brandSecondary, marginRight: 30 }} />
                        <Text>{"    ****" + item.last4}</Text>
                        {item.usando ?
                          (<Text style={{fontSize: 12, color: variables.brandPrimary}}>     USANDO</Text>)
                          :
                          (<Button onPress={() => this.usarTarjeta(key)} style={{width: 70, height: 25, marginTop: 5, marginLeft: 10, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center', position: 'absolute', right: 0}}>
                            <Text style={{fontSize: 12, color: variables.darkGray}}> USAR </Text>
                          </Button>)
                        }{item.usando ?
                          (<View style={{width: 1, height: 1}}/>)
                          :
                          (<Button onPress={() => this.removerTarjeta(key)}style={{width: 70, height: 25, marginTop: 5, marginLeft: 20, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center', position: 'absolute', right: 0}}>
                          <Text style={{fontSize: 12, color: variables.darkGray}}> REMOVER </Text>
                        </Button>)}
                      </View>
                    ))}
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                      <Button onPress={this.agregarTarjeta} style={style.agregarButton}><Text style={{color: 'white'}}>Agregar Tarjeta</Text></Button>
                    </View>
                  </Content>
                  <Button block onPress={this.dismissModal} style={{ height: variables.footerHeight * 1.3 }}>
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
      flexDirection: 'row',
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
      backgroundColor: variables.lighterGray,
      flex: 1,
    },
    agregarButton: {
      borderRadius: 10,
      marginTop: 15,
      paddingLeft: 10,
      paddingRight: 10,
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
    section: {
      backgroundColor: "white",
      flexDirection: "row",
      padding: variables.contentPadding * 2,
      borderTopWidth: variables.borderWidth,
      borderBottomWidth: variables.borderWidth,
      borderColor: variables.listBorderColor
    }
});
