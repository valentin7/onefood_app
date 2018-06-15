// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, TextInput, ActivityIndicator} from "react-native";
import {Button, Header, Left, Right, Body, Icon, Title, Text, H1} from "native-base";
import {Constants} from "expo";

import Mark from "../login/Mark";

import {Container, Images, Field, NavigationHelpers, Styles, SingleChoice, WindowDimensions, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";
import {AnimatedView} from "../components/Animations";


import variables from "../../native-base-theme/variables/commonColor";

type LoginState = {
  email: string,
  password: string,
  loading: boolean
};

export default class SignUp extends React.Component<ScreenProps<>> {

    username: TextInput;
    password: TextInput;

    componentWillMount() {
        this.setState({email: "", password: "", loading: false});
    }

    @autobind
    setEmail(email: string) {
        this.setState({email});
    }

    @autobind
    setPassword(password: string) {
        this.setState({password});
    }

    @autobind
    setUsernameRef(input: TextInput) {
        this.username = input;
    }

    @autobind
    goToUsername() {
        //this.username.focus();
    }

    @autobind
    setPasswordRef(input: TextInput) {
        this.password = input;
    }

    @autobind
    goToPassword() {
        //this.password.focus();
    }

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    /*
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
    */
    @autobind
    async logIn(): Promise<void> {
      const {email, password} = this.state;
      if (email.length <= 1 || password.length <= 1) {
        Alert.alert("Primero llena tu email y contraseña", "");
        return;
      }

      try {
        this.setState({loading: true});
        await Firebase.auth.signInWithEmailAndPassword(email, password);
      } catch (e) {
        console.log("codigo error es: ", e.code);
        this.setState({loading: false});
        if (e.code == "auth/invalid-email") {
          Alert.alert("El email esta mal formateado.", "");
        } else if(e.code == "auth/wrong-password") {
          Alert.alert("Contraseña Incorrecta", "");
        } else if (e.code == "auth/user-not-found") {
          Alert.alert("No existe un usuario con esta contraseña.", "Porfavor confirma que tu email esta bien escrito o crea una cuenta.");
        } else if (e.code == "auth/network-request-failed") {
          Alert.alert("No se pudo conectar a internet.", "Favor de verificar que tu dispositivo tenga acceso a internet.");
        } else {
          Alert.alert("Hubo un error al iniciar sesión.", e.message);
        }
      }
      //this.setState({loading: false});
    }

    render(): React.Node {
        return (
            <Container safe={true}>
                <Header noShadow>
                    <Left>
                        <Button onPress={this.back} transparent>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Log In</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={style.logo}>
                    <View>
                    <Image source={Images.oneFoodLogo} style={style.image} />
                        <H1 style={style.title}>ONEFOOD</H1>
                    </View>
                </View>
                <ActivityIndicator size="large" animating={this.state.loading}/>
                <KeyboardAvoidingView behavior="position">
                    <View style={[Styles.form, style.formView]}>
                        <Field
                            label="Email"
                            textInputRef={this.setUsernameRef}
                            onSubmitEditing={this.goToPassword}
                            onChangeText={this.setEmail}
                            value={this.state.email}
                            returnKeyType="next"
                        />
                        <Field
                            label="Password"
                            secureTextEntry
                            textInputRef={this.setPasswordRef}
                            onSubmitEditing={this.signIn}
                            onChangeText={this.setPassword}
                            value={this.state.password}
                            returnKeyType="go"
                        />
                    </View>
                    <Button primary block onPress={this.logIn} style={{ height: variables.footerHeight }}>
                        <Text style={{color: "white"}}>LOG IN</Text>
                    </Button>
                </KeyboardAvoidingView>

            </Container>
        );
    }
}

const {height, width} = WindowDimensions;

const style = StyleSheet.create({
    img: {
        ...StyleSheet.absoluteFillObject,
        width: WindowDimensions.width,
        height: WindowDimensions.height - Constants.statusBarHeight,
        top: Constants.statusBarHeight
    },
    image: {
        height: 120,
        resizeMode: 'contain',
    },
    formView: {
    },
    row: {
        flexDirection: "row"
    },
    logo: {
      marginVertical: variables.contentPadding,
      alignItems: "center"
    },
    title: {
        marginVertical: variables.contentPadding * 2,
        color: "white",
        textAlign: "center"
    },
    btn: {
        flex: 1,
        margin: 0,
        borderRadius: 0,
        justifyContent: "center",
        alignItems: "center",
        height: 125,
        flexDirection: "column"
    },
    facebook: {
        borderLeftWidth: variables.borderWidth,
        borderColor: "white"
    },
    email: {
        borderTopWidth: variables.borderWidth,
        borderBottomWidth: variables.borderWidth,
        borderColor: "white",
        flexDirection: "row",
        height: 87
    }
});
