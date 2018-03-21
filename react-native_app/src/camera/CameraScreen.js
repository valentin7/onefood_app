import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import autobind from "autobind-decorator";
import Modal from 'react-native-modalbox';
import variables from "../../native-base-theme/variables/commonColor";

import {Button, Icon, Left, H3} from "native-base";


import {BaseContainer, PedidoItem, Firebase} from "../components";
export default class CameraScreen extends React.Component<ScreenProps<>> {
  state = {
    hasCameraPermission: null
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  @autobind
  handleScan({type, data}) {
    //Firebase.firestore.collection("pedidos").doc("")
    this.refs.pedidoModal.open();
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
          <PedidoInfo ref={"pedidoModal"} pedido_id="rigo1" fecha="23/12/2017" cantidad="3" sabor="Chocolate" precioTotal="50" user_id="rigo" al_mes="false" direccionAEntregar="Isla Dorada"/>
        </BaseContainer>
      );
    }
  }
}

const {width} = Dimensions.get("window");

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
    }

    render(): React.Node {
      const {pedido_id} = this.props;
      return <Modal style={[style.modal, style.container]} onClosed={this.setModalStateClosed}  isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
          <Button transparent onPress={this.dismissModal}>
              <Icon name="ios-close-outline" style={style.closeIcon} />
          </Button>
            <PedidoItem
                numero="5"
                title="CHOCOLATE"
            />
            <PedidoItem
                numero="1"
                title="VAINILLA"
            />
            <View style={{marginTop: 20}}>
              <H3>Marzo 12, 2018</H3>
            </View>

        </Modal>;
    }

}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
      fontSize: 50,
      marginLeft: 20,
      color: variables.listBorderColor
  },
    modal: {
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: variables.brandSecondary
  },
});
