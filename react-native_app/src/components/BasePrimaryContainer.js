// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {View, StyleSheet, Image, Platform, Text, Dimensions} from "react-native";
import {H1} from "native-base";
import {StackNavigator} from "react-navigation";
import {Footer, FooterTab, Button, Header as NBHeader, Left, Body, Title, Right, Icon, Content, Tab, Tabs} from "native-base";
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

import type {NavigationProps} from "./Types";

// import variables from "../../native-base-theme/variables/commonColor";
type BaseContainerProps = NavigationProps<> & {
    title: string | React.Node
};

const AppNavigator = StackNavigator(
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

@observer
export default class BaseContainer extends React.Component<BaseContainerProps> {

    state = {
      inMap: false,
      isComprarModalOpen: false,
      screenSelected: "Pedidos",
      mapIconColor: variables.lightGray,
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
      //this.refs.modal.open()
    }

    @autobind
    comprarModalClosing() {
      this.setState({isComprarModalOpen: false});
    }

    mapa() {
      console.log("GOT MAPAAAA");
      this.setState({mapIconColor: variables.brandPrimary, inMap: true, screenSelected: "Mapa"});
      const {navigation} = this.props;
      navigation.navigate("Mapa");
    }

    render(): React.Node {
        const {title, navigation, hasRefresh} = this.props;
        console.log("RENDERING w mapaIconcolor: ", this.state.mapaIconcolor);
        var pedidosIconColor = this.state.screenSelected == "Pedidos" ? variables.brandPrimary : variables.lightGray;
        var mapIconColor =  this.state.screenSelected == "Mapa" ? variables.brandPrimary : variables.lightGray;
        var compraIconColor = this.state.screenSelected == "Comprar" ? variables.brandPrimary : variables.lightGray;
        return (
            <Container safe={true}>
                <NBHeader noShadow style={{backgroundColor: variables.brandSecondary}}>
                    <Left>
                        <Button onPress={() => navigation.navigate("DrawerOpen")} transparent>
                            <EvilIcons name="navicon" size={32} color={variables.brandPrimary}/>
                        </Button>
                    </Left>
                    <Body>
                    {
                        typeof(title) === "string" ? <Title>{title.toUpperCase()}</Title> : title
                    }
                    </Body>
                    <Right style={{ alignItems: "center" }}>
                      {hasRefresh ? (<Button onPress={() => this.props.refresh()} transparent>
                                <EvilIcons name="refresh" size={32} color={variables.brandPrimary} />
                              </Button>
                      ) : (<View/>)}
                    </Right>
                </NBHeader>
                <Tabs initialPage={1} tabBarPosition={"bottom"}>
                    <Tab heading="Pedidos">
                        <Pedidos />
                    </Tab>
                    <Tab heading="Comprar">
                        <Comprar />
                    </Tab>
                    <Tab>
                      <Mapa/>
                    </Tab>
                </Tabs>
                <Comprar isModalOpen={this.state.isComprarModalOpen} onClosing={this.comprarModalClosing} ref={"modal"}></Comprar>
            </Container>
            );
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
