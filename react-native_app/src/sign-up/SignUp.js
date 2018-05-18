// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, ActivityIndicator} from "react-native";
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
        this.username.focus();
    }

    @autobind
    setPasswordRef(input: TextInput) {
        this.password = input;
    }

    @autobind
    goToPassword() {
        this.password.focus();
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
      this.setState({loading: true});
      try {
        await Firebase.auth.signInWithEmailAndPassword(email, password);
      } catch (e) {
        Alert.alert("Hubo un error al iniciar sesión.", e);
      }
      this.setState({loading: false});
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
                <ScrollView style={Styles.flexGrow}>
                <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
                    <View style={Styles.form}>
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
                        <ActivityIndicator size="large" animating={this.state.loading}/>
                    </View>
                    <Button primary block onPress={this.logIn} style={{ height: variables.footerHeight }}>
                        <Text>LOG IN</Text>
                    </Button>
                </KeyboardAvoidingView>
                </ScrollView>

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
    row: {
        flexDirection: "row"
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
