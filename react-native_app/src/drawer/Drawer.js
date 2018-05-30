// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Image, TouchableHighlight} from "react-native";
import {Button, Icon, Header, Text, Left, Title, Body, Right} from "native-base";
import {Constants} from "expo";

import {Images, NavigationHelpers, Styles, WindowDimensions, Container, Firebase} from "../components";
import type {NavigationProps} from "../components/Types";
import { observer, inject } from "mobx-react/native";
import variables from "../../native-base-theme/variables/commonColor";

@inject('store') @observer
export default class Drawer extends React.Component<NavigationProps<>> {

    go(key: string) {
        this.props.navigation.navigate(key);
    }

    @autobind
    logout() {
        this.props.store.pedidos = [];
        this.props.store.last4CreditCard = "";
        Firebase.auth.signOut();
        NavigationHelpers.reset(this.props.navigation, "Login");
    }

    render(): React.Node {
        const {navigation} = this.props;
        return (
            <Container safe={true}>
                <Header style={{borderBottomWidth: 1, borderColor: variables.lightGray}}>
                    <Left>
                        <Button transparent onPress={() => this.go("DrawerClose")}>
                            <Icon name="ios-close-outline" style={style.closeIcon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>NAVIGATE</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={style.itemContainer}>
                    <View style={style.row}>
                        <DrawerItem {...{navigation}} name="Información" id="Walkthrough" icon="ios-information-circle-outline" left/>
                        <DrawerItem {...{navigation}} name="Mapa" id="Mapa" icon="ios-map-outline" />
                    </View>
                    <View style={style.row}>
                        <DrawerItem {...{navigation}} name="Pedidos" id="Pedidos" icon="ios-list-outline" left />
                        <DrawerItem {...{navigation}} name="Compartir" id="Compartir" icon="ios-bonfire-outline" />
                    </View>
                    <View style={style.row}>
                        <DrawerItem {...{navigation}} name="Nosotros" id="Nosotros" icon="ios-leaf-outline" left />
                        {this.props.store.esRep ? (<DrawerItem {...{navigation}} name="Escanear" id="Camera" icon="md-qr-scanner" />) : (<DrawerItem {...{navigation}} name="Ser ONEFOOD Rep" id="SerPro" icon="ios-contact-outline" />)}
                    </View>
                    <View style={style.row}>
                        <DrawerItem {...{navigation}} name="Contacto" id="Contacto" icon="ios-mail-outline" left />
                        <DrawerItem {...{navigation}} name="Settings" id="Settings" icon="ios-options-outline" />
                    </View>
                </View>
                <Button style={{backgroundColor: variables.lighterGray}} block onPress={this.logout}>
                    <Text>LOGOUT</Text>
                </Button>
            </Container>
        );
    }
}

type DrawerItemProps = NavigationProps<> & {
    name: string,
    icon: string,
    left?: boolean
};

class DrawerItem extends React.Component<DrawerItemProps> {
    render(): React.Node {
        const {name, navigation, icon, left, id} = this.props;
        const navState = this.props.navigation.state;
        const active = navState.routes[navState.index].key === name;
        const props = {
            onPress: () => navigation.navigate(id),
            style: [style.item, left ? { borderRightWidth: variables.borderWidth } : undefined]
        };
        return <TouchableHighlight {...props} activeOpacity={.5} underlayColor="rgba(255, 255, 255, .2)">
            <View style={[Styles.center, Styles.flexGrow]}>
                <Icon name={icon} style={{ color: active ? variables.brandPrimary : variables.listBorderColor }} />
                <Text style={{ marginTop: variables.contentPadding }}>{name}</Text>
                {
                    active && <View style={style.dot} />
                }
            </View>
        </TouchableHighlight>;
    }
}

const style = StyleSheet.create({
    img: {
        ...StyleSheet.absoluteFillObject,
        width: WindowDimensions.width,
        height: WindowDimensions.height - Constants.statusBarHeight,
        top: Constants.statusBarHeight
    },
    mask: {
        color: variables.listBorderColor
    },
    closeIcon: {
        fontSize: 50,
        color: variables.listBorderColor
    },
    itemContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    row: {
        flex: 1,
        flexDirection: "row",
        borderColor: variables.listBorderColor,
        borderBottomWidth: variables.borderWidth
    },
    item: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        borderColor: variables.listBorderColor
    },
    dot: {
        backgroundColor: "white",
        height: 10,
        width: 10,
        borderRadius: 5,
        position: "absolute",
        right: variables.contentPadding,
        top: variables.contentPadding,
        alignSelf: "flex-end"
    }
});
