// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, ActivityIndicator} from "react-native";
import {H1, Text, Button, Radio, ListItem, Right, Content, Container, Item, Input, Left, Body, Header, Icon, Title} from "native-base";
import {BaseContainer, Images, Styles, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";

export default class Tarjetas extends React.Component {

    state = {
      subscription: false,
      loading: false,
      isOpen: false,
    }

    open() {
      this.setState({isOpen: true});
    }

    @autobind
    setLinea1(text) {
      this.setState({linea1: text});
    }

    @autobind
    async saveAddress(): Promise<void> {
      this.setState({loading: true});
      var user = Firebase.auth.currentUser;

      // await Firebase.firestore.collection("addresses").doc(user.uid).set(addressInfo)
      // .then(function() {
      //     console.log("SAVED ADDRESS written");
      // })
      // .catch(function(error) {
      //     console.error("Error adding document: ", error);
      // });

      this.setState({loading: false});
      this.dismissModal();
    }

    @autobind
    activarTarjeta(index) {
      console.log("hey index", index);
    }

    @autobind
    removerTarjeta(index) {
      console.log("hey index", index);
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
                          <Title>TARJETAS</Title>
                      </Body>
                      <Right />
                  </Header>
                  <Content style={style.content}>
                    <ActivityIndicator size="large" animating={this.state.loading}/>
                    <View style={style.section}>
                        <Text>
                          <Icon name="ios-card" style={{ color: variables.brandSecondary, marginRight: 30 }} />
                          {this.props.creditDisplay}
                          <Button onPress={() => this.activarTarjeta(0)} style={{width: 70, height: 25, marginTop: 5, marginLeft: 10, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center', position: 'absolute', right: 0}}>
                            <Text style={{fontSize: 12, color: variables.darkGray}}> ACTIVAR </Text>
                          </Button>
                          <Button onPress={() => this.removerTarjeta(0)}style={{width: 70, height: 25, marginTop: 5, marginLeft: 20, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center', position: 'absolute', right: 0}}>
                            <Text style={{fontSize: 12, color: variables.darkGray}}> REMOVER </Text>
                          </Button>
                        </Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                      <Button style={style.agregarButton}><Text style={{color: 'white'}}>Agregar Tarjeta</Text></Button>
                    </View>
                  </Content>
                  <Button block onPress={this.saveAddress} style={{ height: variables.footerHeight * 1.3 }}>
                    <Text style={{color: 'white'}}>LISTO</Text>
                  </Button>
                </Container>
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
      padding: variables.contentPadding * 2,
      borderTopWidth: variables.borderWidth,
      borderBottomWidth: variables.borderWidth,
      borderColor: variables.listBorderColor
    }
});
