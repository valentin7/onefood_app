// @flow
import * as React from "react";
import {View, StyleSheet, Image, Platform, Text, Dimensions} from "react-native";
import {H1} from "native-base";
import {StackNavigator} from "react-navigation";
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
import Modal from 'react-native-modalbox';

import MapView from "expo";

import type {NavigationProps, ChildrenProps} from "./Types";

// import variables from "../../native-base-theme/variables/commonColor";
type BaseContainerProps = NavigationProps<> & ChildrenProps & {
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
      screen: Mapa,
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

export default class BaseContainer extends React.Component<BaseContainerProps> {
    render(): React.Node {
        const {title, navigation} = this.props;
        return (
            <Container safe={true}>
                <NBHeader noShadow>
                    <Left>
                        <Button onPress={() => navigation.navigate("DrawerOpen")} transparent>
                            <EvilIcons name="navicon" size={32} color="white" />
                        </Button>
                    </Left>
                    <Body>
                    {
                        typeof(title) === "string" ? <Title>{title.toUpperCase()}</Title> : title
                    }
                    </Body>
                    <Right style={{ alignItems: "center" }}>
                    <Avatar size={30} />
                    </Right>
                </NBHeader>
                <Content>
                  {this.props.children}
                </Content>
                <Footer>
                    <FooterTab>
                        <Button onPress={() => navigation.navigate("Pedidos")} transparent>
                            <Icon name="ios-list-outline" style={{ fontSize: 32 }} />
                        </Button>
                        <Button transparent onPress={() => this.refs.modal2.open()}>
                            <Icon name="ios-add-circle" style={{ fontSize: 64 }} />
                        </Button>
                        <Button onPress={() => navigation.navigate("Profile")} transparent>
                            <Icon name="ios-map-outline" style={{ fontSize: 32 }} />
                        </Button>
                    </FooterTab>
                </Footer>
                <Comprar ref={"modal2"}></Comprar>


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
