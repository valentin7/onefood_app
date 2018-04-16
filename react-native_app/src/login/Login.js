// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {
    StyleSheet, Image, Alert, View, ScrollView, KeyboardAvoidingView, TextInput, SafeAreaView
} from "react-native";
import {H1, Button, Text, Header} from "native-base";
import {Constants} from "expo";

import Mark from "./Mark";

import {Images, WindowDimensions, Field, NavigationHelpers, Small, Firebase} from "../components";
import {AnimatedView} from "../components/Animations";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

// actually Sign up / crear cuenta state, naming by class.
type LoginState = {
  email: string,
  password: string,
  passwordConfirmation: string,
  name: string,
  codigoInvitacion: string,
}

export default class Login extends React.Component<ScreenProps<>, LoginState> {

    password: TextInput;
    passwordConfirmation: TextInput;
    email: TextInput;
    codigoInvitacion: TextInput;

    constructor(props) {
        super(props);
        this.state = {email: "", password: "", name: ""};
    }

    @autobind
    setPasswordRef(input: TextInput) {
        this.password = input;
    }

    @autobind
    setCodigoRef(input: TextInput) {
        this.codigoInvitacion = input;
    }

    @autobind
    setPasswordConfirmationRef(input: TextInput) {
        this.passwordConfirmation = input;
    }

    @autobind
    setEmailRef(input: TextInput) {
        this.email = input;
    }

    @autobind
    goToPassword() {
        this.password.focus();
    }

    @autobind
    goToPasswordConfirmation() {
        this.passwordConfirmation.focus();
    }

    @autobind
    goToEmail() {
        this.email.focus();
    }

    @autobind
    goToCodigoInvitacion() {
      this.codigoInvitacion.focus();
    }

    @autobind
    setEmail(emailString: string) {
      //this.email.value = emailString;
      this.setState({email: emailString});
      console.log("printing here", this.state.email);
      //this.setState({emailString});
    }

    @autobind
    setPassword(passwordString: string) {
      this.setState({password: passwordString});
    }

    @autobind
    setPasswordConfirmation(passwordString: string) {
      this.setState({passwordConfirmation: passwordString});
    }

    @autobind
    setName(nameString: string) {
      this.setState({name: nameString});
    }

    @autobind
    setCodigoInvitacion(codigo: string) {
      this.setState({codigoInvitacion: codigo});
    }

    @autobind
    async crearCuenta(): Promise<void> {
      console.log("crear cuenta state: ", this.state.email, this.state.password);
      if (this.state.password != this.state.passwordConfirmation) {
          Alert.alert("Las contraseñas no coinciden", "Por favor confirma tu contraseña.");
          this.setPassword("");
          this.setPasswordConfirmation("");
          return;
      }

      if (this.state.codigoInvitacion != undefined) {
        var codigoValido = false;
        await this.aplicarCodigo().then(function(isCodeValid) {
          console.log("return from promise codigoValido ", isCodeValid);
          codigoValido = isCodeValid;
        });
        if (!codigoValido) {
          return;
        }
      }

      try {
        await Firebase.auth.createUserWithEmailAndPassword(this.state.email, this.state.password);
        var user = Firebase.auth.currentUser;
        await user.updateProfile({
          displayName: this.state.name
        }).then(function() {
          console.log("name updated successfully");
        }, function(error) {
          console.log("ERROR for name ", error);
        });


        Firebase.firestore.collection("notFirstTimers").doc(user.uid).set({hasLoggedInBefore: true})
          .then(function() {
              console.log("guardado que ya ha logged in");
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });
          
      } catch (e) {
        Alert.alert("Hubo un error al crear la cuenta.", "Por favor intenta de nuevo.");
        console.log("error de crear cuenta: ", e);
      }
    }

    @autobind
    signIn() {
        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    @autobind
    signUp() {
        this.props.navigation.navigate("SignUp");
    }

    @autobind
    async aplicarCodigo(): Promise<void> {
      console.log("el codigo es ", this.state.codigoInvitacion);

      const docRef = await Firebase.firestore.collection("codigosPromociones").doc(this.state.codigoInvitacion);
      var docExists = false;
      var descuento = 0;
      await docRef.get().then(function(doc) {
          if (doc.exists) {
              docExists = true;
              console.log("Doc exists!!  data:", doc.data());
              descuento = doc.data().descuento;
              var descuentoDisplay = descuento * 100 + "%";
              Alert.alert("Código Válido", "Un descuento de " + descuentoDisplay + " será aplicado a tu próxima compra");
              return true;
          } else {
              Alert.alert("Código de Invitación Inválido", "También puedes crear una cuenta sin código de invitación.");
              return false;
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
          return false;
      });
      return docExists;
    }


    render(): React.Node {
        return (
            <View style={styles.container}>
            <Header noShadow>
            </Header>
                <SafeAreaView style={StyleSheet.absoluteFill}>
                    <ScrollView contentContainerStyle={[StyleSheet.absoluteFill, styles.content]}>
                        <KeyboardAvoidingView behavior="position">
                            <AnimatedView
                                style={{height: height - Constants.statusBarHeight, justifyContent: "flex-end" }}
                            >
                            <View style={styles.logo}>
                                <View>
                                    <Mark />
                                    <H1 style={styles.title}>ONEFOOD</H1>
                                </View>
                            </View>
                            <View>
                              <Field
                                  label="Nombre"
                                  returnKeyType="next"
                                  value={this.state.name}
                                  onChangeText={this.setName}
                                  onSubmitEditing={this.goToPassword}
                                  inverse
                              />
                                <Field
                                    label="Email"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    value={this.state.email}
                                    textInputRef={this.setEmailRef}
                                    onSubmitEditing={this.goToPassword}
                                    onChangeText={this.setEmail}
                                    inverse
                                />
                                <Field
                                    label="Contraseña"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    returnKeyType="go"
                                    textInputRef={this.setPasswordRef}
                                    value={this.state.password}
                                    onChangeText={this.setPassword}
                                    onSubmitEditing={this.goToConfirmPassword}
                                    inverse
                                />
                                <Field
                                    label="Confirmar Contraseña"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    returnKeyType="go"
                                    textInputRef={this.setPasswordConfirmationRef}
                                    value={this.state.passwordConfirmation}
                                    onChangeText={this.setPasswordConfirmation}
                                    onSubmitEditing={this.goToCodigoInvitacion}
                                    inverse
                                />
                                <Field
                                  label="Código de invitación (opcional)"
                                  returnKeyType="go"
                                  autoCapitalize="characters"
                                  autoCorrect={false}
                                  textInputRef={this.setCodigoRef}
                                  value={this.state.codigoInvitacion}
                                  onChangeText={this.setCodigoInvitacion}
                                  onSubmitEditing={this.crearCuenta}
                                  last
                                  inverse
                                />
                                <View>
                                    <View>
                                        <Button primary full onPress={this.crearCuenta}>
                                            <Text>Crear Cuenta</Text>
                                        </Button>
                                    </View>
                                    <View>
                                        <Button transparent full onPress={this.signUp}>
                                            <Small style={{color: "white"}}>{"Ya tienes cuenta? Log In"}</Small>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                            </AnimatedView>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

const {height, width} = WindowDimensions;

//TODO: aqui cambiar para que salga el Sign Up.
const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        height,
        width
    },
    content: {
        flexGrow: 1,
        top: -25
    },
    logo: {
        marginVertical: variables.contentPadding * 2,
        alignItems: "center"
    },
    title: {
        marginVertical: variables.contentPadding * 2,
        color: "white",
        textAlign: "center"
    },
    small: {
        color: "white"
    }
});
