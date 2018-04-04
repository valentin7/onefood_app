// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {
    StyleSheet, Image, View, ScrollView, KeyboardAvoidingView, TextInput, SafeAreaView
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
  name: string
}

export default class Login extends React.Component<ScreenProps<>, LoginState> {

    password: TextInput;
    email: TextInput;

    constructor(props) {
        super(props);
        this.state = {email: "", password: "", name: ""};
    }

    @autobind
    setPasswordRef(input: TextInput) {
        this.password = input;
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
    goToEmail() {
        this.email.focus();
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
    setName(nameString: string) {
      this.setState({name: nameString});
    }

    @autobind
    async crearCuenta(): Promise<void> {
      console.log("crear cuenta state: ", this.state.email, this.state.password);
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

      //  NavigationHelpers.reset(this.props.navigation, "Walkthrough");
      } catch (e) {
        alert(e);
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
                                    onSubmitEditing={this.signIn}
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
