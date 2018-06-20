import React from 'react';
import {View, TouchableOpacity, Dimensions, StyleSheet, Alert} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import {Container, Text, Header, Right, Left, Icon, Content, Button, Body, Title, H3} from 'native-base';
import autobind from "autobind-decorator";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";

import {BaseContainer, PedidoItem, Firebase} from "../components";

const {width, height} = Dimensions.get("window");

export default class ScanCoupon extends React.Component {
  state = {
    hasCameraPermission: null,
    pedidoInfo: {},
    cuponValido: false,
    justScanned: false,
    isOpen: false,
  };

  open() {
    this.setState({isOpen: true});
  }

  componentDidMount () {
    this.setState({justScanned: false});
  }
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  @autobind
  async handleScan({type, data}): Promise<void> {

    if (this.state.justScanned) {
      return;
    }

    this.setState({justScanned: true});
    //Firebase.firestore.collection("pedidos").doc("")
    console.log("data and type ", data, type);

    const docRef = await Firebase.firestore.collection("codigosPromociones").doc(data);
    var docExists = false;
    var cuponValido = true;
    var pedidoInfo = {};

    await docRef.get().then(function(doc) {
        if (doc.exists) {
            docExists = true;
            console.log("Codigo Promocion exists!!  data:", doc.data());

            if (doc.data().reclamado) {
              cuponValido = false;
            }

            var prevData = doc.data();
            prevData["reclamado"] = true;
            docRef.set(prevData)
            .then(function() {
              console.log("successfully claimed pedido");
            });
            pedidoInfo = prevData;
            // .catch(function(error) {
            //   console.error("error writing doc: ", error);
            // });
        } else {
            cuponValido = false;
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });


    if (docExists && cuponValido) {
      Alert.alert("Cupón Aplicado!", "Tienes 50% de descuento en tu próxima compra");
      this.setState({pedidoInfo: pedidoInfo, cuponValido: true});
    } else {
      Alert.alert("Cupón Invalido");
      this.setState({cuponValido: false});
    }

    //this.refs.pedidoModal.open();
  }

  @autobind
  onModalClose() {
    console.log("yeah nigg");
    this.setState({justScanned: false});
  }

  @autobind
  dismissModal() {
    this.setState({isOpen: false});
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <Text></Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Modal style={[style.modal]} isOpen={this.state.isOpen} animationDuration={400} swipeToClose={false} coverScreen={true} position={"center"}>
          <Container safe={true} >
          <Header style={{borderBottomWidth: 1, borderColor: variables.lightGray, height: 70, width: width}}>
              <Left>
                  <Button transparent onPress={this.dismissModal}>
                      <Icon name="ios-close-outline" style={style.closeIcon} />
                  </Button>
              </Left>
              <Body style={{width: 60}}>
                  <Title>ESCANEAR</Title>
              </Body>
              <Right/>
          </Header>
          <BarCodeScanner onBarCodeRead={this.handleScan} style={{height: width, width: width}}>
        </BarCodeScanner>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: variables.darkGray, marginTop: 15, fontSize: 18}}>Escanea Cupones y Descuentos ONEFOOD</Text>
          </View>
        </Container>
        </Modal>
      );
    }
  }
}


class PedidoInfo extends React.Component<PedidoProps> {
    state = {
      detailModalIsOpen: false,
    }

    open() {
      this.setState({detailModalIsOpen: true});
      //this.refs.modal.open();
    }

    @autobind
    setModalStateClosed() {
      this.setState({detailModalIsOpen: false});
    }

    @autobind
    dismissModal() {
      this.setState({detailModalIsOpen: false});
      this.props.onModalClose();
    }

    render(): React.Node {
      const {pedidoInfo, cuponValido} = this.props;

      return <Modal style={style.modal} swipeToClose={false} onClosed={this.setModalStateClosed}  isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>

          {
            cuponValido ?
            (<Container style={style.container}>
                <Button transparent onPress={this.dismissModal}>
                    <Icon name="ios-close-outline" style={style.closeIcon} />
                </Button>
                <PedidoItem
                  numero={pedidoInfo.cantidades[0]}
                  title="CHOCOLATE"
              />
              <View style={{marginTop: 20}}>
                <H3>{pedidoInfo.fecha}</H3>
              </View>
            </Container>) :
            (<Container style={style.container}>
                <Button transparent onPress={this.dismissModal}>
                    <Icon name="ios-close-outline" style={style.closeIcon} />
                </Button>
              <Text>Pedido Inválido</Text>
              </Container>
            )
          }
        </Modal>;
    }
}



const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
  },
  closeIcon: {
      fontSize: 50,
      marginLeft: 20,
      color: variables.brandPrimary,
  },
  closeButton: {
    marginTop: 60,
  },
    modal: {
    height: height,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: variables.brandInfo
  },
});
