// @flow
import * as React from "react";
import {StyleSheet, Image} from "react-native";
import {Footer, FooterTab, Button, Header as NBHeader, Left, Body, Title, Right, Icon, Content} from "native-base";
import {EvilIcons} from "@expo/vector-icons";
import {Constants} from "expo";

import Avatar from "./Avatar";
import Images from "./images";
import WindowDimensions from "./WindowDimensions";
import Container from "./Container";

import MapView from "expo";

import type {NavigationProps, ChildrenProps} from "./Types";

// import variables from "../../native-base-theme/variables/commonColor";
type BaseContainerProps = NavigationProps<> & ChildrenProps & {
    title: string | React.Node
};

export default class BaseContainer extends React.Component<BaseContainerProps> {
    render(): React.Node {
        const {title, navigation} = this.props;
        return (
            <Container safe={true}>
                <Image source={Images.signUp} style={[StyleSheet.absoluteFill, style.img]} />
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
                        <Button transparent onPress={() => navigation.navigate("Comprar")}>
                            <Icon name="ios-add-circle" style={{ fontSize: 64 }} />
                        </Button>
                        <Button onPress={() => navigation.navigate("Mapa")} transparent>
                            <Icon name="ios-map-outline" style={{ fontSize: 32 }} />
                        </Button>
                    </FooterTab>
                </Footer>
                </Container>
            );
    }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    img: {
        width: WindowDimensions.width,
        height: WindowDimensions.height - Constants.statusBarHeight,
        top: Constants.statusBarHeight
    }
});
