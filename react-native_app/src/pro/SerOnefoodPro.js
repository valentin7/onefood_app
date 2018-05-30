// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, Alert} from "react-native";
import {H1, Text, Input, Item, Content, Button} from "native-base";

import {BaseContainer, TaskOverview, Images, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";
import Autolink from "react-native-autolink";
import autobind from "autobind-decorator";
import { observer, inject } from "mobx-react/native";

@inject('store') @observer
export default class SerOnefoodPro extends React.Component<ScreenProps<>> {

  state = {
    codigo: ""
  }

  @autobind 
  async checarCodigo(): Promise<void> {
    if (this.state.codigo == "O123") {
      this.props.store.esRep = true;
      Alert.alert("¡Felicitaciones!", "Ahora eres un ONEFOOD REP. En el menú principal encontrarás tus nuevas funciones.");
      console.log("lo lograste");
      var user = Firebase.auth.currentUser;

      await Firebase.firestore.collection("usersInfo").doc(user.uid).update({esRep: true})
      .then(function() {
          console.log("Updated el estado de Rep");

      })
      .catch(function(error) {
          console.error("Error adding document: ", error.message);
          Alert.alert("Hubo un error al actualizar el código", error.message);
      });

    } else {
      Alert.alert("Código Inválido", "");
    }
  }

  @autobind
  setCodigo(codigo) {
    console.log("aqui ", codigo);
    this.setState({codigo: codigo});
  }


    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Ser Pro" navigation={this.props.navigation} scrollable>
            <View style={style.row}>
              <Text style={style.paragraph}>
              Ser un ONEFOOD Rep es ...
              </Text>
              <Text style={style.paragraph}>
              Si estas interesado, mándanos un email a <Autolink linkStyle={style.link} text="hola@onefood.com.mx" email={true}/> con foto de tu IFE. Si eres aceptado, te mandaremos un código único para darte de alta.
              </Text>
              <Item underline style={{marginTop: 15, marginBottom: 15}}>
                <Input placeholder='Código' onChangeText={this.setCodigo} autoCorrect={false}/>
              </Item>
              <Button block rounded onPress={this.checarCodigo}>
                <Text style={{color: "white"}}>Ingresar</Text>
              </Button>
            </View>
        </BaseContainer>;
    }
}

/*
<Text style={style.paragraph}>
ONEFOOD es una comida liquida tecnológica, desarrollada por ingenieros químicos en alimento, investigadores y nutriólogos para suplir una comida completa de manera práctica, fácil y nutrimentalmente mejor que una comida promedio.
</Text>
*/

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750,
        resizeMode: "cover"
    },
    paragraph: {
      marginBottom: 12,
    },
    row: {
        justifyContent: "center",
        alignItems: "center",
        padding: variables.contentPadding * 2
    },
    link: {
      fontSize: 20,
      color: variables.brandPrimary
    }

});
