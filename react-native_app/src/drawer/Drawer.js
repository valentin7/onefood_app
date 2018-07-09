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

const iconImages = {
  perfil: {
    normal: require('../components/images/iconos/perfil.png'),
    active: require('../components/images/iconos/perfil_v.png')
  },
  compartir: {
    normal: require('../components/images/iconos/compartir.png'),
    active: require('../components/images/iconos/compartir_v.png')
  },
  comprar: {
     normal: require('../components/images/iconos/comprar.png'),
     active: require('../components/images/iconos/comprar_v.png')
  },
  contacto: {
    normal: require('../components/images/iconos/contacto.png'),
    active: require('../components/images/iconos/contacto_v.png'),
  },
  info: {
    normal: require('../components/images/iconos/info.png'),
    active: require('../components/images/iconos/info_v.png')
  },
  nosotros: {
    normal: require('../components/images/iconos/nosotros.png'),
    active: require('../components/images/iconos/nosotros_v.png')
  },
  rep: {
    normal: require('../components/images/iconos/rep.png'),
    active: require('../components/images/iconos/rep_v.png')
  },
  mapa: {
    normal: require('../components/images/iconos/mapa.png'),
    active: require('../components/images/iconos/mapa_v.png')
  }
};

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
                        <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
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
                        <DrawerItem {...{navigation}} name="Información" id="Info" icon={iconImages.info} left/>
                        <DrawerItem {...{navigation}} name="Mapa" id="Mapa" icon={iconImages.mapa} />
                    </View>
                    <View style={style.row}>
                        <DrawerItem {...{navigation}} name="Pedidos" id="Pedidos" icon={iconImages.comprar} left />
                        <DrawerItem {...{navigation}} name="Compartir" id="Compartir" icon={iconImages.compartir} />
                    </View>
                    <View style={style.row}>
                        <DrawerItem {...{navigation}} name="Nosotros" id="Nosotros" icon={iconImages.nosotros} left />
                        {this.props.store.esRep ? (<DrawerItem {...{navigation}} name="Info Rep" id="InfoRep" icon={iconImages.rep} />) : (<DrawerItem {...{navigation}} name="Ser ONEFOOD Rep" id="SerPro" icon={iconImages.rep} />)}
                    </View>
                    <View style={style.row}>
                        <DrawerItem {...{navigation}} name="Contacto" id="Contacto" icon={iconImages.contacto} left />
                        <DrawerItem {...{navigation}} name="Perfil" id="Settings" icon={iconImages.perfil} />
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
        // var active_icon = '../components/images/iconos/' + icon + '_v.png';
        // var icon_img = '../components/images/iconos/' + icon + '.png'
        return <TouchableHighlight {...props} activeOpacity={.5} underlayColor="rgba(255, 255, 255, .2)">
            <View style={[Styles.center, Styles.flexGrow]}>
              {active ?
                <Image resizeMode="contain" style={{height: 40}} source={icon.active} />
                :
                <Image resizeMode="contain" style={{height: 40}} source={icon.normal} />
              }
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
