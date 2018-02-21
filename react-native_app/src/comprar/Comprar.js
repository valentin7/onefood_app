// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, InteractionManager, Animated, ScrollView} from "react-native";
import {H1, Text, Button, Radio, ListItem, Right, Content, CheckBox, Container, Header, Left, Icon, Title, Body, Footer} from "native-base";
import ImageSlider from 'react-native-image-slider';
import {BaseContainer, TaskOverview, Images, Styles, PrecioTotal, QuantityInput, Address} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import {StackNavigator, StackRouter} from 'react-navigation';

import variables from "../../native-base-theme/variables/commonColor";

export default class Comprar extends React.Component {
    static router = ComprarRouter;

    state = {
      subscription: false,
      isOpen: false,
    }

    componentWillMount() {
    }

    open() {
      this.setState({isOpen: true});
      //this.refs.modal2.open();
    }

    @autobind
    toggleSubscriptionYes() {
      this.setState({subscription: true});
    }

    @autobind
    toggleSubscriptionNo() {
      this.setState({subscription: false});
    }

    @autobind
    dismissModal() {
      this.setState({isOpen: false});
    }

    static navigationOptions = {
      title: 'Welcome',
    };

    render(): React.Node {
        const today = moment();
        return <Modal style={[style.modal, style.modal2]} isOpen={this.state.isOpen} swipeToClose={false}  backdrop={false} position={"top"} ref={"modal2"}>
            <Container>
              <Header>
                <Left>
                    <Button transparent onPress={this.dismissModal}>
                        <Icon name="ios-close-outline" style={style.closeIcon} />
                    </Button>
                </Left>
                <Body>
                    <Title>COMPRAR</Title>
                </Body>
                <Right />
              </Header>
              <Content>
                <Image source={Images.music} style={style.img} />
                <View style={[style.count, Styles.center]}>
                    <H1 style={style.heading}>CHOCOLATE</H1>
                    <Text style={Styles.grayText}>SABOR</Text>
                    <QuantityInput singular="botella" plural="botellas" from={0} to={120} />
                </View>
                <View style={[style.count, Styles.center]}>
                    <H1 style={style.heading}>VAINILLA</H1>
                    <Text style={Styles.grayText}>SABOR</Text>
                    <QuantityInput singular="botella" plural="botellas" from={0} to={120} />
                </View>
                <View>
                  <ListItem onPress={this.toggleSubscriptionNo}>
                    <Text>Una Vez</Text>
                    <Right>
                      <CheckBox onPress={this.toggleSubscriptionNo} checked={!this.state.subscription}/>
                    </Right>
                  </ListItem>
                  <ListItem onPress={this.toggleSubscriptionYes}>
                    <Text>Subscripción</Text>
                    <Right>
                      <CheckBox onPress={this.toggleSubscriptionYes} checked={this.state.subscription} />
                    </Right>
                  </ListItem>
                </View>

                <View>
                  <ListItem onPress={this.toggleSubscriptionNo}>
                    <Text>Entrega a Domicilio</Text>
                    <Right>
                      <CheckBox onPress={this.toggleSubscriptionNo} checked={!this.state.subscription}/>
                    </Right>
                  </ListItem>
                  <ListItem onPress={this.toggleSubscriptionYes}>
                    <Text>Me queda de pasada</Text>
                    <Right>
                      <CheckBox onPress={this.toggleSubscriptionYes} checked={this.state.subscription} />
                    </Right>
                  </ListItem>
                </View>
              </Content>
              <Button primary block onPress={() => this.refs.modal.open()} style={{ height: variables.footerHeight * 1.3 }}>
                <Text>CONTINUAR</Text>
                <Text>  (Total: $50)</Text>
              </Button>
            </Container>
            <Address ref={"modal"}></Address>
        </Modal>;
    }
}

class DetallesScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.name,
  });
  render() {
    const { goBack } = this.props.navigation;
    return (
      <Button
        title="Go back"
        onPress={() => goBack()}
      />
    );
  }
}

const ComprarRouter = StackRouter({
  Comprar: {screen: Comprar},
  Detalles: {screen: DetallesScreen},
}, {
  initialRouteName: 'Comprar',
});



/*<ImageSlider images={[
     Images.music,
     Images.travel
 ]}/>*/

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750,
        resizeMode: "cover",
        marginBottom: 7,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
        flex: 1,
        flexDirection: "row",
        borderColor: variables.listBorderColor,
        borderBottomWidth: variables.borderWidth,
        alignItems: 'center',
    },
    column: {
      flex: 1,
      flexDirection: "column",
      borderColor: variables.listBorderColor,
      borderBottomWidth: variables.borderWidth
    },
    itemContainer: {
        flex: 1
    },
    priceContainer: {
        flexDirection: "row",
        borderTopWidth: variables.borderWidth,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    leftCell: {
        borderRightWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    count: {
        flex: .5,
        padding: variables.contentPadding * 2
    },
    heading: {
        color: "white"
    },
    modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal2: {
    backgroundColor: "#3B5998"
  },
});
