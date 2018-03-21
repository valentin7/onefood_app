// @flow
import * as React from "react";
import autobind from "autobind-decorator";
import {View, Dimensions, Image, StyleSheet} from "react-native";
import {Text, Icon, Left, Right, Header, Container, Content, Button, Body, Title} from "native-base";

import {BaseContainer, Images, Field, SingleChoice} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";

export default class CheckoutConfirmation extends React.Component<ScreenProps<>> {

    state = {
      isOpen: false,
    }

    open() {
      this.setState({isOpen: true});
    }

    @autobind
    dismissModal() {
      this.setState({isOpen: false});
    }

    render(): React.Node {
    return  <Modal style={[style.modal]} isOpen={this.state.isOpen} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"} ref={"modal2"}>
              <Container safe={true}>
                <Header>
                    <Left>
                        <Button transparent onPress={this.dismissModal}>
                            <Icon name="ios-close-outline" style={style.closeIcon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title>CHECKOUT</Title>
                    </Body>
                    <Right />
                </Header>
                <Content style={style.content}>
                  <View style={style.img}>
                      <Image source={Images.profile} resizeMode="cover" style={[StyleSheet.absoluteFill, style.img]} />
                      <View style={style.add}>
                          <Icon name="ios-card" style={{ color: variables.brandSecondary }} />
                      </View>
                  </View>
                  <View style={style.section}>
                      <Text>GENERAL</Text>
                  </View>
                  <View>
                      <Field label="Name" defaultValue="Fernando Fernandez" />
                      <Field label="Email" defaultValue="fer@gmail.com" />
                  </View>

                  <View style={style.section}>
                      <Text>MÉTODO DE PAGO</Text>
                  </View>
                  <View>

                  </View>
                </Content>
                <Button primary block onPress={this.dismissModal} style={{ height: variables.footerHeight * 1.3 }}>
                  <Text>COMPRAR</Text>
                </Button>
              </Container>
      </Modal>;
    }
}

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750
    },
    add: {
        backgroundColor: "white",
        height: 50,
        width: 50,
        borderRadius: 25,
        position: "absolute",
        bottom: variables.contentPadding,
        left: variables.contentPadding,
        alignItems: "center",
        justifyContent: "center"
    },
    section: {
        padding: variables.contentPadding * 2,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    modal: {
      backgroundColor: variables.brandInfo
    }
});
