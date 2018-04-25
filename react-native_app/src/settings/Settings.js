// @flow
import * as React from "react";
import {View, Dimensions, Image, StyleSheet} from "react-native";
import {Text, Icon} from "native-base";
import autobind from "autobind-decorator";
import {BaseContainer, Images, Field, SingleChoice, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";
import { observer, inject } from "mobx-react/native";
import variables from "../../native-base-theme/variables/commonColor";

@inject('store') @observer
export default class Settings extends React.Component<ScreenProps<>> {

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
            console.log("Doc exists!!  data:", doc.data());
            last4 = doc.data().last_four;
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

  render(): React.Node {
      var user = Firebase.auth.currentUser;
      var creditDisplay = "**** "+ this.props.store.last4CreditCard;
      if (this.props.store.last4CreditCard.length < 1) {
        creditDisplay = " Agregar Tarjeta";
      }
      return <BaseContainer title="Settings" navigation={this.props.navigation} scrollable>
          <View style={style.section}>
              <Text>GENERAL</Text>
          </View>
          <View>
              <Field style={style.field} label="Name" defaultValue={user.displayName}/>
              <Field style={style.field} label="Email" defaultValue={user.email} />
          </View>

          <View style={style.section}>
              <Text>MÉTODO DE PAGO</Text>
              <Text><Icon name="ios-card" style={{ color: variables.brandSecondary }} /> {creditDisplay} </Text>
          </View>
          <View>

          </View>
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
    }
});
