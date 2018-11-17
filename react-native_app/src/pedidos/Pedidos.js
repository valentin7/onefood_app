// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl, ScrollView, Image, ImageBackground, YellowBox, Alert} from "react-native";
import {Button, Icon, Container, Card, CardItem, Left, Right, H3, Separator, ListItem, List} from "native-base";
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
import Conekta from "react-native-conekta";

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
      selectedPedidoStatus: "",
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
      var pedidosSubscriptions = [];
      query.forEach(doc => {
        if (doc.data().subscription) {
          pedidosSubscriptions.push(doc.data());
        }
        else if (doc.data().reclamado) {
          pedidosHistorial.push(doc.data());
        } else {
          pedidos.push(doc.data());
        }
      });

      this.props.store.pedidos = pedidos;
      this.props.store.subscriptions = pedidosSubscriptions;

      if (pedidosSubscriptions.length > 0) {
        //this.setState({selectedPedidoStatus: pedidosSubscriptions[0].subscriptionStatus});
        this.props.store.subscriptionStatus = pedidosSubscriptions[0].subscriptionStatus;
      }

      this.setState({
        pedidos,
        pedidosHistorial,
        pedidosSubscriptions,
        loading: false,
        refreshing: false,
        haRefreshedPedidos: true,
      });
    }

    @autobind @action
    async updateCustomerId(): Promise<void> {
      var user = Firebase.auth.currentUser;

      const docRef = await Firebase.firestore.collection("usersInfo").doc(user.uid);
      var docExists = false;
      var conektaCustomerId = undefined;
      await docRef.get().then(function(doc) {
          if (doc.exists) {
              docExists = true;
              conektaCustomerId = doc.data().conektaCustomerId;
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      //console.log("wasup here: ", this.props.store.conektaCustomerId, conektaCustomerId);
      this.props.store.conektaCustomerId = conektaCustomerId;
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
              isRep = doc.data().esRep;
              if (isRep) {
                phoneNumber = doc.data().phone;
              }
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      this.props.store.esRep = isRep;
      this.props.store.repPhone = phoneNumber;
      if (phoneNumber == undefined) {
        this.props.store.repPhone = "";
      }
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
      this.fetchCreditCardDetails();
      this.updateCustomerId();

      //if (this.props.store.subscriptions.length > 0) {
        //this.setState({selectedPedidoStatus: this.props.store.subscriptions[0].subscriptionStatus});
      //}


      // var conektaApi = new Conekta();
      // conektaApi.setPublicKey('key_KoqjzW5XMEVcwxdqHsCFY4Q');
    }

    @autobind
    async updateSubscriptionStatus(): Promise<void> {
      // var user = Firebase.auth.currentUser;
      // const docRef = await Firebase.firestore.collection("usersInfo").doc(user.uid);
      // var docExists = false;
      // var activeSubPedidoId = undefined;
      // await docRef.get().then(function(doc) {
      //     if (doc.exists) {
      //         docExists = true;
      //         activeSubPedidoId = doc.data().activeSubscription;
      //         console.log("FOUND IT BOI ", activeSubPedidoId);
      //     } else {
      //         console.log("No such document!");
      //     }
      // }).catch(function(error) {
      //     console.log("Error getting document:", error);
      // });


    }

    @autobind
    async getLocationIfEnabled(): Promise<void> {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status == 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        this.props.store.userLocationOnMap = location;
      }
    }

    @autobind
    open(pedidoInfo, isSubscription) {
      console.log("OPENING! subscription? ", isSubscription);
      this.setState({selectedPedido: pedidoInfo});

      if (isSubscription) {
        this.refs.subscriptionModal.open();
        //this.setState({selectedPedidoStatus: pedidoInfo.subscriptionStatus});
      } else {
        this.refs.pedidoModal.open();
      }

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

    @autobind
    subStatusChange(newStatus, oldToDelete) {
      this.props.store.subscriptionStatus = newStatus;
      if (this.props.store.subscriptions) {
        this.props.store.subscriptions = this.props.store.subscriptions.filter(pedido => pedido.pedido_id != oldToDelete);
      } else {
        console.log("store subscriptions undefined? ", this.props.store.subscriptions);
      }
    }

    @autobind
    subscriptionModalOnClose() {
    }

    render(): React.Node {
        //console.log("rendering pedidoss ", this.props.store.pedidos);
        //console.log("historial: ", this.state.pedidosHistorial);
        //var user = Firebase.auth.currentUser;
        var welcomeMessage = "Bienvenid@, ahora eres parte de la familia OneFood.";
        if (this.state.usersName.length > 1) {
          //this.setState({usersName: user.name});
          welcomeMessage = "Bienvenid@ " + this.state.usersName + ".";
        }

        console.log("from the store substatus: " , this.props.store.subscriptionStatus)

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
                        { this.state.haRefreshedPedidos && this.props.store.pedidos.length == 0 && this.props.store.subscriptions.length == 0 && this.state.pedidosHistorial == 0 ? (
                          <View>
                            <Text style={style.welcomeMessage}>{welcomeMessage}</Text>
                          </View>
                        ) :
                        (<View/>)
                        }

                    { this.props.store.subscriptions.length > 0 ? (
                      <Separator style={style.divider}>
                        <Text style={{color: variables.darkGray, fontWeight: "bold"}}>Suscripción</Text>
                      </Separator>
                    ) : (<View/>)}

                    {this.props.store.subscriptions.map((item, key) =>
                      (<ListItem key={key} style={{height: 70, backgroundColor: "white", flexDirection: 'column', alignItems: 'flex-start'}} onPress={() => this.open(item, true)}>
                        <Text style={style.pedidoTitulo}> {item.cantidades.reduce(function(acc, val) {return acc + val})} ONEFOODS AL MES</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={style.pedidoFecha}>{Constants.convertirFechaParaSubscripcion(item.fecha)}</Text>
                          <Text style={this.props.store.subscriptionStatus == "ACTIVA" ? style.subscriptionActive : style.subscriptionPaused}>{this.props.store.subscriptionStatus}</Text>
                        </View>
                      </ListItem>))
                    }

                    { this.props.store.pedidos.length > 0 ? (
                      <Separator style={style.divider}>
                        <Text style={{color: variables.darkGray, fontWeight: "bold"}}>Pedidos a reclamar</Text>
                      </Separator>
                    ) : (<View/>)}

                    {this.props.store.pedidos.map((item, key) =>
                      (<ListItem key={key} style={{height: 70, backgroundColor: "white", flexDirection: 'column', alignItems: 'flex-start'}} onPress={() => this.open(item, false)}>
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
                        <Text style={Styles.grayText}> {item.cantidades.reduce(function(acc, val) {return acc + val})} ONEFOODS</Text>
                        <Text style={style.pedidoFecha}>{Constants.convertirFechaCorta(item.fecha)}</Text>
                      </ListItem>))
                    }
                   </ScrollView>
                   </View>
                  )}
                  </View>
                  {this.props.store.esRep && <ScanPedido ref={"scanPedidoModal"}/>}
                  <SubscriptionDetalle ref={"subscriptionModal"} onClose={this.subscriptionModalOnClose} subStatusChange={this.subStatusChange} subscriptionStatus={this.props.store.subscriptionStatus} pedidoInfo={this.state.selectedPedido} pedido_id={this.state.selectedPedidoId} conektaCustomerId={this.props.store.conektaCustomerId} fecha={this.state.selectedDate} cantidades={this.state.selectedPQuantities} precioTotal={this.state.selectedTotalPrice}/>
                  <PedidoDetalle ref={"pedidoModal"} pedidoInfo={this.state.selectedPedido} pedido_id={this.state.selectedPedidoId} fecha={this.state.selectedDate} cantidades={this.state.selectedPQuantities} precioTotal={this.state.selectedTotalPrice} refreshPedidos={this.refreshPedidos}/>
        </BaseContainer>
        </ImageBackground>;
    }
}

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
    }

    @autobind
    setModalStateClosed() {
      this.setState({detailModalIsOpen: false});
      //this.props.onClose();
    }

    @autobind
    dismissModal() {
      this.props.refreshPedidos();
      this.setState({detailModalIsOpen: false});
    }

    render(): React.Node {
      const {pedidoInfo, pedido_id, fecha, cantidades, precioTotal} = this.props;
      var pedidoId = 0;
      var pedidoFecha = "";
      var showQR = false;
      var pedidoItems = []
      if (pedidoInfo != undefined) {
        pedidoId = pedidoInfo.pedido_id;
        pedidoFecha = Constants.convertirFecha(pedidoInfo.fecha);
        //pedidoFecha = pedidoInfo.fecha;
        showQR = !pedidoInfo.reclamado;
        pedidoItems = pedidoInfo.cantidades.map((cantidad, index) => {
          return <PedidoItem
            key={index}
            numero={cantidad}
            title={pedidoInfo.sabores[index]}/>
        });
      }



      return <Modal style={[style.modal, style.container]} swipeToClose={false} onClosed={this.setModalStateClosed}  isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
          <Button transparent onPress={this.dismissModal} style={{top: 20}}>
              <Icon color={variables.brandPrimary} name="ios-close-outline" style={style.closeIcon} />
          </Button>
          <ScrollView contentContainerStyle={[style.scrollDetail]}>
            <View style={{marginBottom: 50}}/>
            {
              showQR ?
              (<QRCode
                    value={pedidoId}
                    size={200}
                    bgColor={variables.brandPrimary}
                    fgColor='white'/>) :
              (<View/>)
            }
              {pedidoItems}
              <View style={{marginTop: 20}}>
                <Text style={{color: variables.darkGray, fontSize: 17}}>{pedidoFecha}</Text>
              </View>
              <View style={{margin: 20, marginBottom: 80}}>
                <Text style={{color: variables.lightGray, fontSize: 14}}>Recibe tus ONEFOODS presentando este código QR a uno de nuestros representantes.</Text>
              </View>

            </ScrollView>

        </Modal>;
    }
}

class SubscriptionDetalle extends React.Component<PedidoProps> {
    state = {
      detailModalIsOpen: false,
      subscriptionStatus: "ACTIVA",
      loading: false,
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

    @autobind
    async pauseSubscription(): Promise<void> {
      this.setState({loading: true});
      try {
        let response = await fetch(Constants.serverlessURL + '/production/pauseSubscription', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: this.props.conektaCustomerId,
          }),
        });
        let responseJSON = await response.json();
        console.log("PAUSED SUBSC responseJSON is: ", responseJSON);

        if (responseJSON.message != "Subscription paused successfully") {
          this.setState({loading: false});
          Alert.alert("Hubo un error al pausar tu suscripción automáticamente.", "Por favor mandar un email a soporte@onefood.com.mx para pausarla.");
          return;
        } else {

          await Firebase.firestore.collection("pedidos").doc(this.props.pedidoInfo.pedido_id).update({subscriptionStatus: "PAUSADA"})
          .then(function() {
              console.log("Subscripcion PAUSADA en FIREBASE");
          })
          .catch(function(error) {
              console.error("Error updating document: ", error);
              Alert.alert("No se pudo pausar tu suscripción automáticamente en este momento.", "Por favor mandar un email a soporte@onefood.com.mx para pausarla.");
          });
        }
      } catch (error) {
        console.error(error);
        this.setState({loading: false});
        Alert.alert("Hubo un error al pausar tu suscripción automáticamente.", "Por favor mandar un email a soporte@onefood.com.mx para pausarla.");
        return;
      }
      this.setState({loading: false, subscriptionStatus: "PAUSADA"});
      this.props.subStatusChange("PAUSADA", "");
      Alert.alert("Suscripción Pausada", "No se te cargaran nuevos montos hasta que reanudes tu suscripción.");
    }

    @autobind
    async resumeSubscription(): Promise<void> {
      this.setState({loading: true});
      try {
        let response = await fetch(Constants.serverlessURL + '/production/resumeSubscription', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: this.props.conektaCustomerId,
          }),
        });
        let responseJSON = await response.json();

        if (responseJSON.message != "Subscription resumed successfully") {
          this.setState({loading: false});
          Alert.alert("Hubo un error al reanudar tu suscripción automáticamente.", "Por favor mandar un email a soporte@onefood.com.mx para reanudarla.");
          return;
        } else {

          await Firebase.firestore.collection("pedidos").doc(this.props.pedidoInfo.pedido_id).update({subscriptionStatus: "ACTIVA"})
          .then(function() {
              console.log("Subscripcion RESUMIDA en FIREBASE");
          })
          .catch(function(error) {
              console.error("Error updating document: ", error);
              Alert.alert("No se pudo resumir tu suscripción automáticamente en este momento.", "Por favor mandar un email a soporte@onefood.com.mx para resumirla.");
          });
        }
      } catch (error) {
        console.error(error);
        this.setState({loading: false});
        Alert.alert("Hubo un error al resumir tu suscripción automáticamente.", "Por favor mandar un email a soporte@onefood.com.mx para resumir.");
        return;
      }
      this.setState({loading: false, subscriptionStatus: "ACTIVA"});
      this.props.subStatusChange("ACTIVA", "");
      Alert.alert("Suscripción Resumida", "Te damos una cordial bienvenida de regreso.");
    }

    @autobind
    subStatusChange(newStatus, oldToDelete) {
      this.props.subStatusChange(newStatus, oldToDelete);
    }

    @autobind
    async cancelSubscription(): Promise<void> {
      this.setState({loading: true});
      try {
        let response = await fetch(Constants.serverlessURL + '/production/cancelSubscription', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: this.props.conektaCustomerId,
          }),
        });
        let responseJSON = await response.json();

        if (responseJSON.message != "Subscription cancelled successfully") {
          this.setState({loading: false});
          Alert.alert("Hubo un error al cancelar tu suscripción automáticamente.", "Por favor mandar un email a soporte@onefood.com.mx para cancelarla.");
          return;
        } else {

          await Firebase.firestore.collection("pedidos").doc(this.props.pedidoInfo.pedido_id).delete()
          .then(function() {
              console.log("Subscripcion CANCELADA y BORRADA en FIREBASE");
          })
          .catch(function(error) {
              console.error("Error updating document: ", error);
              Alert.alert("No se pudo cancelar tu suscripción automáticamente en este momento.", "Por favor mandar un email a soporte@onefood.com.mx para cancelarla. Diles que tuviste el código 2.");
          });

          var user = Firebase.auth.currentUser;
          await Firebase.firestore.collection("usersInfo").doc(user.uid).update({activeSubscription: ""})
          .then(function() {
              console.log("Subscripcion puesta en no activa en FIREBASE");
          })
          .catch(function(error) {
              console.error("Error updating document: ", error);
              //Alert.alert("No se pudo pausar tu suscripción automáticamente en este momento.", "Por favor mandar un email a soporte@onefood.com.mx para pausarla.");
          });
          // borrar de store this.props
        }
      } catch (error) {
        console.error(error);
        this.setState({loading: false});
        Alert.alert("Hubo un error al cancelar tu suscripción automáticamente.", "Por favor mandar un email a soporte@onefood.com.mx para cancelarla.");
        return;
      }
      this.setState({loading: false, subscriptionStatus: "CANCELADA"});
      this.props.subStatusChange("CANCELADA", this.props.pedidoInfo.pedido_id);
      Alert.alert("Suscripción Cancelada", "Puedes volver a crear una suscripción en la sección de compra.")
      //this.dismissModal();
    }

    render(): React.Node {
      const {pedidoInfo, pedido_id, fecha, cantidades, precioTotal, subscriptionStatus} = this.props;
      var pedidoId = 0;
      var pedidoFecha = "";
      var entregaFechas = "";
      var showQR = false;
      var textoCreacion = "";
      var textoEntrega = "";
      var textoStatus = "";
      //var subscriptionStatus = "";
      var pedidoItems = []
      if (pedidoInfo != undefined) {
        pedidoId = pedidoInfo.pedido_id;
        pedidoFecha = Constants.convertirFecha(pedidoInfo.fecha);
        entregaFechas = Constants.convertirFechaParaSubscripcion(pedidoInfo.fecha);
        //pedidoFecha = pedidoInfo.fecha;
        showQR = !pedidoInfo.reclamado;
        //subscriptionStatus = this.props.subscriptionStatus;
        //this.setState({subscriptionStatus: pedidoInfo.subscriptionStatus});
        textoCreacion = "Suscripción fue creada el " + pedidoFecha;
        textoEntrega = "Se entrega " + entregaFechas.toLowerCase();
        textoStatus = "Status: ";
        pedidoItems = pedidoInfo.cantidades.map((cantidad, index) => {
          return <PedidoItem
            key={index}
            numero={cantidad}
            title={pedidoInfo.sabores[index]}/>
        });
      }
      var subscriptionTextColor = this.props.subscriptionStatus == "ACTIVA" ? variables.brandPrimary : variables.brandWarning;

      var botonPausarResumir = this.props.subscriptionStatus == "ACTIVA" ?
      (<Button onPress={() => this.pauseSubscription()} style={{width: 165, height: 25, marginTop: 5, marginLeft: 10, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center'}}>
        <Text style={{fontSize: 12, color: variables.darkGray}}> PAUSAR SUSCRIPCIÓN </Text>
      </Button>)
      :
      (<Button onPress={() => this.resumeSubscription()} style={{width: 165, height: 25, marginTop: 5, marginLeft: 10, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center'}}>
        <Text style={{fontSize: 12, color: variables.darkGray}}> REANUDAR SUSCRIPCIÓN </Text>
      </Button>)

      var botonCancelar = (<Button onPress={() => this.cancelSubscription()} style={{width: 165, height: 25, marginTop: 5, marginLeft: 10, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center'}}>
        <Text style={{fontSize: 12, color: variables.darkGray}}> CANCELAR SUSCRIPCIÓN </Text>
      </Button>)

      if (this.props.subscriptionStatus == "CANCELADA") {
        botonPausarResumir = null;
        botonCancelar = null;
      }
      console.log("THE PROPS SUBSCRITIONSTATUS: ", this.props.subscriptionStatus);

      return <Modal style={[style.modal, style.container]} subStatusChange={this.subStatusChange} onClosed={this.setModalStateClosed} swipeToClose={false}  isOpen={this.state.detailModalIsOpen} backdrop={true} position={"bottom"} coverScreen={true} ref={"modal"}>
          <Button transparent onPress={this.dismissModal} style={{top: 20}}>
              <Icon color={variables.brandPrimary} name="ios-close-outline" style={style.closeIcon} />
          </Button>
          <Text style={{color: variables.brandPrimary, fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>
          SUSCRIPCIÓN
          </Text>
          <ActivityIndicator size="large" animating={this.state.loading}/>
          <ScrollView contentContainerStyle={[style.scrollDetail]}>
            {pedidoItems}
            <View style={{marginTop: 20}}>
              <Text style={{color: variables.darkGray, fontSize: 17}}>{textoEntrega}</Text>
            </View>
            <View style={{marginTop: 20, flexDirection: 'row'}}>
              <Text style={{color: variables.darkGray, fontSize: 17}}>{textoStatus}</Text>
              <Text style={{color: subscriptionTextColor, fontSize: 17, marginLeft: 5}}>{this.props.subscriptionStatus}</Text>
            </View>
            <View style={{marginTop: 20, flexDirection: 'row'}}>
              {botonPausarResumir}
              {botonCancelar}
            </View>

            <View style={{margin: 20}}>
              <Text style={{color: variables.lightGray, fontSize: 14}}>{textoCreacion}</Text>
            </View>
          </ScrollView>

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
    subscriptionActive: {
      color: variables.brandPrimary,
      fontSize: 14,
      marginLeft: 30,
    },
    subscriptionPaused: {
      color: variables.brandWarning,
      fontSize: 14,
      marginLeft: 30,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollDetail: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      backgroundColor: "white",
      flexDirection: "row",
      padding: variables.contentPadding * 2,
      borderTopWidth: variables.borderWidth,
      borderBottomWidth: variables.borderWidth,
      borderColor: variables.listBorderColor
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
