// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, InteractionManager, Animated, ScrollView} from "react-native";
import {H1, Text, Button, Radio, ListItem, Right, Content, Container, CheckBox, Form, Item, Input, Left, Body, Header, Icon, Title} from "native-base";
import {BaseContainer, Images, Styles} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";

export default class Address extends React.Component {

    state = {
      subscription: false,
      isOpen: false,
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
    dismissModal() {
      this.setState({isOpen: false});
    }

    render(): React.Node {

        return <Modal style={[style.modal]} isOpen={this.state.isOpen} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"} ref={"modal2"}>
                <Container safe={true}>
                  <Header>
                      <Left>
                          <Button transparent onPress={this.dismissModal}>
                              <Icon name="ios-close-outline" style={style.closeIcon} />
                          </Button>
                      </Left>
                      <Body>
                          <Title>ADDRESS</Title>
                      </Body>
                      <Right />
                  </Header>
                  <Content style={style.content}>
                    <Form>
                      <Item>
                        <Input placeholder="Dirección Línea 1" />
                      </Item>
                      <Item>
                        <Input placeholder="Dirección Línea 2" />
                      </Item>
                      <Item>
                        <Input placeholder="Ciudad" />
                      </Item>
                      <Item>
                        <Input placeholder="Estado" />
                      </Item>
                      <Item last>
                        <Input placeholder="Código Postal" />
                      </Item>
                    </Form>
                  </Content>
                  <Button primary block onPress={this.dismissModal} style={{ height: variables.footerHeight * 1.3 }}>
                    <Text>LISTO</Text>
                  </Button>
                </Container>
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
        color: variables.listBorderColor
    },
    content: {
      backgroundColor: variables.brandSecondary,
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
