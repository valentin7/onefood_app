// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, RefreshControl, ScrollView, Image, ImageBackground, YellowBox} from "react-native";
import {Button, Icon, Card, CardItem, Left, Right, H3, Separator, ListItem, List} from "native-base";
import {observable, action} from "mobx";
import { observer, inject } from "mobx-react/native";
import { Location, Permissions } from 'expo';
import Modal from 'react-native-modalbox';
import QRCode from 'react-native-qrcode';
import PTRView from 'react-native-pull-to-refresh';
import * as Constants from '../Constants';

import {BaseContainer, Styles, JankWorkaround, Task, PedidoItem, Firebase, Images, ScanPedido} from "../components";
import type {ScreenProps} from "../components/Types";
import PedidoModel from "../components/APIStore";

import variables from "../../native-base-theme/variables/commonColor";

@inject('store') @observer
export default class Pedidos extends React.Component<ScreenProps<>> {

    state = {
      loading: true,
      haRefreshedPedidos: false,
      pedidos: [],
      pedidosHistorial: [],
      refreshing: false,
      selectedPedidoId: "",
      selectedPQuantities: [],
      selectedDate: "",
      selectedTotalPrice: 0,
      usersName: "",
    }

    constructor(props) {
      super(props);
      this.open = this.open.bind(this);
    }

    componentWillMount() {
      YellowBox.ignoreWarnings(['Class RCTCxxModule']);
    }

    @autobind @action
    async refreshPedidos(): Promise<void> {
      this.setState({refreshing: true});
      var user = Firebase.auth.currentUser;
      if (user == null) {
        return;
      }

      this.setState({usersName: user.displayName});
      const query = await Firebase.firestore.collection("pedidos").where("user_id", "==", user.uid).get().catch(function(error) {
          console.log("Error getting documents: ", error);
      });
      var pedidos = [];
      var pedidosHistorial = [];
      query.forEach(doc => {
        if (doc.data().reclamado) {
          pedidosHistorial.push(doc.data());
        } else {
          pedidos.push(doc.data());
        }
      });

      this.props.store.pedidos = pedidos;

      this.setState({
        pedidos,
        pedidosHistorial,
        loading: false,
        refreshing: false,
        haRefreshedPedidos: true,
      });
    }

    @autobind @action
    async updateRepStatus(): Promise<void> {
      var user = Firebase.auth.currentUser;

      const docRef = await Firebase.firestore.collection("usersInfo").doc(user.uid);
      var docExists = false;
      var isRep = false;
      var phoneNumber = "";
      await docRef.get().then(function(doc) {
          if (doc.exists) {
              docExists = true;
              console.log("acuyo Doc exists!!  data:", doc.data());
              isRep = doc.data().esRep;
              if (isRep) {
                phoneNumber = doc.data().phone;
                console.log("werejo ", phoneNumber);
              }
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      console.log("es rep firebase? ", isRep);
      this.props.store.esRep = isRep;
      this.props.store.repPhone = phoneNumber;
    }
    
    @autobind @action
    async fetchCreditCardDetails(): Promise<void> {
      var user = Firebase.auth.currentUser;
      // check whether we already have his credit card details.
      const docRef = await Firebase.firestore.collection("paymentInfos").doc(user.uid);
      var docExists = false;
      var last4 = "";
      await docRef.get().then(function(doc) {
          if (doc.exists) {
              docExists = true;
              var tarjetas = doc.data().tarjetas;
              for (var i = 0; i < tarjetas.length; i++) {
                if (tarjetas[i].usando) {
                  last4 = tarjetas[i].last4;
                }
              }
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      this.props.store.last4CreditCard = last4;
    }

    @action
    componentDidMount() {
      this.refreshPedidos();
      this.updateRepStatus();
      JankWorkaround.runAfterInteractions(() => {
        this.setState({ loading: false });
      });
      this.getLocationIfEnabled();
    }

    @autobind
    async getLocationIfEnabled(): Promise<void> {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status == 'granted') {

        console.log("giving it away here boi");
        let location = await Location.getCurrentPositionAsync({});
        this.props.store.userLocationOnMap = location;
      }
    }

    open(pedidoInfo) {
      console.log("pedidoInfo is ", pedidoInfo);
      this.setState({selectedPedido: pedidoInfo});
      this.refs.pedidoModal.open();
    }

    @autobind
    dismissModal() {
      this.setState({isOpen: false});
    }

    @autobind
    comprar() {
      this.refs.baseComponent.comprar();
    }

    @autobind
    escanearPedido() {
      this.refs.scanPedidoModal.open();
    }

    render(): React.Node {
        console.log("rendering pedidoss ", this.props.store.pedidos);
        console.log("historial: ", this.state.pedidosHistorial);
        //var user = Firebase.auth.currentUser;
        var welcomeMessage = "Bienvenid@, ahora eres parte de la familia OneFood.";
        if (this.state.usersName.length > 1) {
          //this.setState({usersName: user.name});
          welcomeMessage = "Bienvenid@ " + this.state.usersName + ".";
        }

        return <ImageBackground source={Images.oneFull} style={style.fullScreenImage}>
                <BaseContainer ref="baseComponent" title="Pedidos" hasRefresh={true} refresh={this.refreshPedidos} navigation={this.props.navigation} >
                  <View style={style.transparent}>
                  {this.state.loading ? (
                    <Loading />
                  ) : (
                    <View style={style.transparent}>
                    <Button block style={style.compraButton} onPress={this.comprar}>
                      <H3 style={{color: 'white'}}>Nueva Compra</H3>
                    </Button>

                    {this.props.store.esRep && <Button block style={style.escanearButton} onPress={this.escanearPedido}>
                      <H3 style={{color: 'white'}}>Escanear Pedido</H3>
                    </Button>}

                    <ScrollView refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this.refreshPedidos}/> }>
                        { this.state.haRefreshedPedidos && this.props.store.pedidos.length == 0 && this.state.pedidosHistorial == 0 ? (
                          <View>
                            <Text style={style.welcomeMessage}>{welcomeMessage}</Text>
                          </View>
                        ) :
                        (<View/>)
                        }

                    { this.props.store.pedidos.length > 0 ? (
                      <Separator style={style.divider}>
                        <Text style={{color: variables.darkGray, fontWeight: "bold"}}>Pedidos a reclamar</Text>
                      </Separator>
                    ) : (<View/>)}

                    {this.props.store.pedidos.map((item, key) =>
                      (<ListItem key={key} style={{height: 70, backgroundColor: "white", flexDirection: 'column', alignItems: 'flex-start'}} onPress={() => this.open(item)}>
                        <Text style={style.pedidoTitulo}> {item.cantidades.reduce(function(acc, val) {return acc + val})} ONEFOODS</Text>
                        <Text style={style.pedidoFecha}>{Constants.convertirFechaCorta(item.fecha)}</Text>
                      </ListItem>))
                    }

                    { this.state.pedidosHistorial.length > 0 ? (
                      <Separator style={style.divider}>
                        <Text style={{fontWeight: "bold"}}>Historial de Pedidos</Text>
                      </Separator>
                    ) : (<View/>)}

                    {this.state.pedidosHistorial.map((item, key) =>  (
                      <ListItem key={key} style={{height: 70, backgroundColor: "white", flexDirection: 'column', alignItems: 'flex-start'}} onPress={() => this.open(item)}>
                        <Text style={Styles.grayText}> {item.cantidades[0]} ONEFOODS</Text>
                        <Text style={style.pedidoFecha}>{Constants.convertirFechaCorta(item.fecha)}</Text>
                      </ListItem>))
                    }
                   </ScrollView>
                   </View>
                  )}
                  </View>
                  {this.props.store.esRep && <ScanPedido ref={"scanPedidoModal"}/>}
                  <PedidoDetalle ref={"pedidoModal"} pedidoInfo={this.state.selectedPedido} pedido_id={this.state.selectedPedidoId} fecha={this.state.selectedDate} cantidades={this.state.selectedPQuantities} precioTotal={this.state.selectedTotalPrice} user_id="rigo" al_mes="false" direccionAEntregar="Isla Dorada"/>
        </BaseContainer>
        </ImageBackground>;
    }
}

//{this.state.pedidos.forEach(pedido => <PedidoDetalle ref={"pedidoModal"} pedido_id={pedido.pedido_id} fecha={pedido.fecha} cantidades={pedido.cantidades} precioTotal={pedido.precio_total}/>)}

type PedidoProps = {
  pedido_id: string,
  fecha: string,
  cantidades: number[],
  sabores: string[],
  precioTotal: number,
  user_id: string,
  subscription: boolean,
  domicilio: string
}
class PedidoDetalle extends React.Component<PedidoProps> {
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
      const {pedidoInfo, pedido_id, fecha, cantidades, precioTotal} = this.props;
      var pedidoId = 0;
      var cocoaQuantity = 0;
      var pedidoFecha = "";
      var showQR = false;
      if (pedidoInfo != undefined) {
        pedidoId = pedidoInfo.pedido_id;
        cocoaQuantity = pedidoInfo.cantidades[0];
        pedidoFecha = Constants.convertirFecha(pedidoInfo.fecha);
        //pedidoFecha = pedidoInfo.fecha;
        showQR = !pedidoInfo.reclamado;
      }



      return <Modal style={[style.modal, style.container]} onClosed={this.setModalStateClosed}  isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
          <Button transparent onPress={this.dismissModal}>
              <Icon color={variables.brandPrimary} name="ios-close-outline" style={style.closeIcon} />
          </Button>
          {
            showQR ?
            (<QRCode
                  value={pedidoId}
                  size={200}
                  bgColor={variables.brandPrimary}
                  fgColor='white'/>) :
            (<View/>)
          }
            <PedidoItem
                numero={cocoaQuantity}
                title="COCOA"
            />
            <View style={{marginTop: 20}}>
              <Text style={{color: variables.darkGray, fontSize: 17}}>{pedidoFecha}</Text>
            </View>

            <View style={{margin: 20}}>
              <Text style={{color: variables.lightGray, fontSize: 14}}>Recibe tus ONEFOODS presentando este código QR a uno de nuestros representantes.</Text>
            </View>

        </Modal>;
    }
}

//  <Text>Entrega a domicilio</Text>
  //<Text>Polanco 4815, Torre 16, Numero 23\n 42, Ciudad de Mexico</Text>
const Loading = () => (
  <View style={style.container}>
    <Text></Text>
  </View>
);

type ItemProps = {
    title: string,
    pedido_id: string,
    done?: boolean
};

@observer
class Item extends React.Component<ItemProps> {
    @observable done: boolean;

    constructor(props) {
      super(props);
      this.open = this.open.bind(this);
    }
    componentWillMount() {
        const {done} = this.props;
        this.done = !!done;
    }

    @autobind @action
    toggle() {
        this.done = !this.done;
    }

    open() {
      this.refs.pedidoModal.open();
      //this.refs.pedido.open();
      //          <PedidoDetalle ref={"pedido"} pedido_id="rigo1" fecha="23/12/2017" cantidad="3" sabor="cocoa" precioTotal="50" user_id="rigo" al_mes="false" direccionAEntregar="Isla Dorada"/>

    }

    render(): React.Node  {
        const {title} = this.props;
        const {pedido_id} = this.props;
        const txtStyle = this.done ? Styles.grayText : Styles.whiteText;
        return <View style={[Styles.listItem, { marginHorizontal: 0 }]}>
                    <View style={[Styles.center, style.title]}>
                        <Text style={txtStyle}>{title}</Text>
                    </View>
                </View>
    }
}

const {width} = Dimensions.get("window");

const style = StyleSheet.create({
    mask: {
        backgroundColor: "rgba(0, 0, 0, .5)"
    },
    button: {
        height: 75, width: 75, borderRadius: 0
    },
    compraButton: {
        height: 60,
        borderRadius: 5,
    },
    escanearButton: {
        height: 60,
        borderRadius: 5,
        backgroundColor: variables.brandSecondary,
    },
    closeIcon: {
        fontSize: 50,
        marginLeft: 20,
        color: variables.brandPrimary
    },
    number: {
        alignItems: "center",
        flexDirection: "row",
        padding: variables.contentPadding
    },
    transparent: {
      backgroundColor: "rgba(0, 0, 0, 0)"
    },
    divider: {
      backgroundColor: variables.listSeparatorOBg,
      height: 40,
    },
    welcomeMessage: {
      color: variables.darkGray,
      margin: 10,
      fontSize: variables.fontSizeBase * 2,
      marginTop: 15,
      fontStyle: "italic",
    },
    title: {
        justifyContent: "center",
        flex: 1,
        padding: variables.contentPadding
    },
    titleText: {
        fontSize: variables.fontSizeBase * 2 + variables.contentPadding,
        color: "white"
    },
    timelineLeft: {
        flex: .5,
        borderRightWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    timelineRight: {
        flex: .5,
        justifyContent: "flex-end"
    },
    pedidoTitulo: {
      top: 10,
    },
    pedidoFecha: {
      color: variables.lightGray,
      fontSize: 12,
      left: 5,
      bottom: -12,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
        paddingLeft: variables.contentPadding
    },
    image: {
        height: 80,
        resizeMode: 'contain',
    },
    modal: {
      height: 600,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    fullScreenImage: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  },
});
