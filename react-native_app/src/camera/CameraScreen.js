import React from 'react';
import {View, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import {Container, Text} from 'native-base';
import autobind from "autobind-decorator";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";
import * as Constants from '../Constants';

import {Button, Icon, Left, H3} from "native-base";


import {BaseContainer, PedidoItem, Firebase} from "../components";
export default class CameraScreen extends React.Component<ScreenProps<>> {
  state = {
    hasCameraPermission: null,
    pedidoInfo: {},
    pedidoValido: false,
    justScanned: false,
  };

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

    const docRef = await Firebase.firestore.collection("pedidos").doc(data);
    var docExists = false;
    var pedidoValido = true;
    var pedidoInfo = {};

    await docRef.get().then(function(doc) {
        if (doc.exists) {
            docExists = true;
            console.log("Pedido exists!!  data:", doc.data());

            if (doc.data().reclamado) {
              pedidoValido = false;
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
            pedidoValido = false;
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });


    if (docExists && pedidoValido) {
      this.setState({pedidoInfo: pedidoInfo, pedidoValido: true});
    } else {
      this.setState({pedidoValido: false});
    }

    this.refs.pedidoModal.open();
  }

  @autobind
  onModalClose() {
    console.log("yeah nigg");
    this.setState({justScanned: false});
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <Text></Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <BaseContainer style={{flex: 1}} title="Escanear" navigation={this.props.navigation}>
          <View style={{ flex: 1 }}>
            <BarCodeScanner onBarCodeRead={this.handleScan} style={{ flex: 1, height: width}}>
              <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                  }}>
                </View>
            </BarCodeScanner>
          </View>
          <PedidoInfo ref={"pedidoModal"} onModalClose={this.onModalClose} pedidoInfo={this.state.pedidoInfo} pedidoValido={this.state.pedidoValido}/>
        </BaseContainer>
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
      const {pedidoInfo, pedidoValido} = this.props;
      var pedidoFecha = Constants.convertirFecha(pedidoInfo.fecha);
      return <Modal style={style.modal} swipeToClose={false} onClosed={this.setModalStateClosed}  isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>

          {
            pedidoValido ?
            (<Container style={style.container}>
                <Button transparent onPress={this.dismissModal}>
                    <Icon name="ios-close-outline" style={style.closeIcon} />
                </Button>
                <PedidoItem
                  numero={pedidoInfo.cantidades[0]}
                  title="COCOA"
              />
              <View style={{marginTop: 20}}>
                <H3>{pedidoFecha}</H3>
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
const {width, height} = Dimensions.get("window");

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
      color: variables.brandPrimary
  },
  closeButton: {
    marginTop: 60,
  },
    modal: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: variables.brandInfo
  },
});
