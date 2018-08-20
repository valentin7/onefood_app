// @flow
import * as React from "react";
import {View, Dimensions, Image, StyleSheet} from "react-native";
import {Text, Icon, Button} from "native-base";
import autobind from "autobind-decorator";
import {BaseContainer, Images, Field, SingleChoice, Firebase, Tarjetas} from "../components";
import type {ScreenProps} from "../components/Types";
import { observer, inject } from "mobx-react/native";
import variables from "../../native-base-theme/variables/commonColor";

@inject('store') @observer
export default class Settings extends React.Component<ScreenProps<>> {

  state = {
    isTarjetasOpen: false,
  }
  componentWillMount() {
    if (this.props.store.last4CreditCard.length < 1) {
      this.getLast4Digits();
    }
  }

  @autobind
  async getLast4Digits(): Promise<void> {
    var user = Firebase.auth.currentUser;
    const docRef = await Firebase.firestore.collection("paymentInfos").doc(user.uid);
    var docExists = false;
    var last4 = "";
    await docRef.get().then(function(doc) {
        if (doc.exists) {
            docExists = true;
            var tarjetas = doc.data().tarjetas;
            for (var i = 0; i < tarjetas.length; i++) {
              if (tarjetas[i].usando) {
                last4 = tarjetas[i].last_four;
              }
            }
            console.log("indiegogo ", last4);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    this.props.store.last4CreditCard = last4;
  }

  @autobind
  dismissTarjetasModal() {
    this.setState({isTarjetasOpen: false});
  }

  render(): React.Node {
      var user = Firebase.auth.currentUser;
      var creditDisplay = "    **** "+ this.props.store.last4CreditCard;
      if (this.props.store.last4CreditCard.length <= 1) {
        creditDisplay = "  Agregar Tarjeta";
      }
      return <BaseContainer title="Perfil" navigation={this.props.navigation} scrollable>
          <View style={style.section}>
              <Text style={{fontWeight: "bold"}}>GENERAL</Text>
          </View>
          <View>
            <View style={style.row}>
              <Text style={style.label}>NOMBRE</Text>
              <Text style={style.mainText}>{user.displayName}</Text>
            </View>
            <View style={style.row}>
              <Text style={style.label}>EMAIL</Text>
              <Text style={style.mainText}>{user.email}</Text>
            </View>
          </View>

          <View style={style.section}>
              <Text style={{fontWeight: "bold"}}>MÉTODO DE PAGO</Text>
          </View>
          <View style={[style.section, {flexDirection: 'row'}]}>
          <Icon name="ios-card" style={{ color: variables.brandSecondary, marginRight: 30}} />
          <Text style={{top: 2, left: -5}}>
            {creditDisplay}
          </Text>
          <Button onPress={() => this.setState({isTarjetasOpen: true})} style={{width: 70, height: 25, marginTop: 5, marginLeft: 10, backgroundColor: variables.lighterGray, borderRadius: 6, justifyContent: 'center'}}>
            <Text style={{fontSize: 12, color: variables.darkGray}}>EDITAR</Text>
          </Button>
          </View>
          <Tarjetas isTarjetasOpen={this.state.isTarjetasOpen} dismissTarjetasModal={this.dismissTarjetasModal} creditDisplay={creditDisplay}></Tarjetas>
      </BaseContainer>;
  }
}

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750
    },
    field: {
      color: variables.darkGray,
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
    row: {
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        flexDirection: "row",
        alignItems: "center",
        height: 75
    },
    label: {
      fontSize: 14,
      marginHorizontal: variables.contentPadding * 2,
      color: variables.mediumGray
    },
    mainText: {
        flex: 1,
        color: variables.darkGray,
    }
});
