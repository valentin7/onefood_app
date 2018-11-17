// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {View, StyleSheet, Image, Platform, Text, Dimensions} from "react-native";
import {H1} from "native-base";
import {createStackNavigator, NavigationActions} from "react-navigation";
import {Footer, FooterTab, Button, Header as NBHeader, Left, Body, Title, Right, Icon, Content} from "native-base";
import {EvilIcons} from "@expo/vector-icons";
import {Constants} from "expo";
import {PrecioTotal} from "./PrecioTotal";
import {Styles} from "./Styles";

import Avatar from "./Avatar";
import Images from "./images";
import WindowDimensions from "./WindowDimensions";
import Container from "./Container";
import {Comprar} from "./../comprar"
import {Mapa} from "./../mapa"
import {Pedidos} from "./../pedidos"
import Modal from 'react-native-modalbox';
import { observer } from "mobx-react/native";

import MapView from "expo";

import variables from "../../native-base-theme/variables/commonColor";

import type {NavigationProps, ChildrenProps} from "./Types";

// import variables from "../../native-base-theme/variables/commonColor";
type BaseContainerProps = NavigationProps<> & ChildrenProps & {
    title: string | React.Node
};

const AppNavigator = createStackNavigator(
  {
    ComprarStack: {
      name: "Comprar",
      description: "Comprar bro",
      screen: Comprar,
    },
    Index: {
      screen: Pedidos,
    },
  },
  {
    initialRouteName: 'Index',
    headerMode: 'none',

    /*
   * Use modal on iOS because the card mode comes from the right,
   * which conflicts with the drawer example gesture
   */
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }
);

const mapaIcon = require('../components/images/iconos/mapa_v.png');

@observer
export default class BaseContainer extends React.Component<BaseContainerProps> {

    state = {
      inMap: false,
      isComprarModalOpen: false,
      screenSelected: "Pedidos",
      mapIconColor: variables.lightGray,
      isConfirmationPopUpOpen: false,

    }

    componentWillMount() {
    }

    pedidos() {
      this.setState({inMap: false, screenSelected: "Pedidos"});
      const {navigation} = this.props;
      navigation.navigate("Pedidos");
    }

    @autobind
    comprar() {
      this.setState({isComprarModalOpen: true, screenSelected: "Comprar", inMap: false});
    }

    @autobind
    comprarModalClosing(compra) {
      this.setState({isComprarModalOpen: false});
      console.log("comprar modal closing bro: ", compra);
      // if (compra) {
      //   this.setState({isConfirmationPopUpOpen: true});
      // }
    }

    @autobind
    onConfirmationOkClick() {
      this.setState({isConfirmationPopUpOpen: false});
    }

    mapa() {
      console.log("GOT MAPAAAA");
      this.setState({mapIconColor: variables.brandPrimary, inMap: true, screenSelected: "Mapa"});
      const {navigation} = this.props;
      navigation.navigate("Mapa");
    }

    render(): React.Node {
        const {title, navigation, hasRefresh} = this.props;
        var pedidosIconColor = this.state.screenSelected == "Pedidos" ? variables.brandPrimary : variables.brandPrimary;
        var mapIconColor =  this.state.screenSelected == "Mapa" ? variables.brandPrimary : variables.brandPrimary;
        var compraIconColor = this.state.screenSelected == "Comprar" ? variables.brandPrimary : variables.brandPrimary;
        return (
            <Container safe={true}>
                <NBHeader style={{backgroundColor: variables.brandInfo, borderBottomWidth: 1, borderColor: variables.lightGray}}>
                    <Left>
                        <Button onPress={() => navigation.toggleDrawer()} transparent>
                            <EvilIcons name="navicon" size={32} color={variables.brandPrimary}/>
                        </Button>
                    </Left>
                    <Body>
                    {
                        typeof(title) === "string" ? <Title style={{color: variables.brandPrimary}}>{title.toUpperCase()}</Title> : title
                    }
                    </Body>
                    <Right style={{ alignItems: "center" }}>
                      {hasRefresh ? (<Button onPress={() => this.props.refresh()} transparent>
                                <EvilIcons name="refresh" size={32} color={variables.brandPrimary} />
                              </Button>
                      ) : (<View/>)}
                    </Right>
                </NBHeader>
                <Content>
                  {this.props.children}
                </Content>
                <Footer style={{backgroundColor: variables.brandInfo, borderTopWidth: 1, borderColor: variables.lightGray}}>
                    <FooterTab>
                        <Button onPress={() => this.pedidos()} transparent>
                            <Icon name="ios-list-outline" style={{ fontSize: 32, color: pedidosIconColor}} />
                        </Button>
                        <Button transparent onPress={() => this.comprar()} transparent>
                            <Icon name="ios-add-circle"  style={{ fontSize: 56, color: compraIconColor}} />
                        </Button>
                        <Button onPress={() => this.mapa()} transparent>
                            <Image resizeMode="contain" style={{height: 30, width: 30}} source={mapaIcon} />
                        </Button>
                    </FooterTab>
                </Footer>
                <ConfirmationPopUp ref={"confirmationPopUp"} isConfirmationPopUpOpen={this.state.isConfirmationPopUpOpen} onConfirmationOkClick={this.onConfirmationOkClick}/>
                <Comprar isModalOpen={this.state.isComprarModalOpen} onClosing={this.comprarModalClosing} ref={"modal"}></Comprar>
            </Container>
            );
    }
}

class ConfirmationPopUp extends React.Component {

    render(): React.Node {

      let mensaje = "Encuentra alguno de nuestros representantes en el mapa y enséñales el código QR de tu pedido. Puedes ver tus pedidos al continuar."
      // if (this.props.domicilio) {
      //   mensaje = "Tu pedido se entregará " + this.props.descFechaEntrega
      // }

      return <Modal style={[style.modal, style.container]} swipeToClose={false} onClosed={this.setModalStateClosed}  isOpen={this.props.isConfirmationPopUpOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
          <Button transparent onPress={this.dismissModal} style={{top: 20}}>
              <Icon color={variables.brandPrimary} name="ios-close-outline" style={style.closeIcon} />
          </Button>
          <View style={{margin: 50}}>
            <Text style={{color: variables.darkGray, fontSize: 22, marginBottom: 15}}>¡Pago confirmado!</Text>
            <Text style={{color: variables.mediumGray, fontSize: 18}}>{mensaje}</Text>
          </View>
          <Button primary block onPress={this.props.onConfirmationOkClick} style={{ height: variables.footerHeight * 1.3 }}>
            <Text style={{color: 'white'}}>OK</Text>
          </Button>
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
  img: {
      width,
      height: width * 500 / 750,
      resizeMode: "cover"
  },
    modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal2: {
    backgroundColor: "#3B5998"
  },
});
