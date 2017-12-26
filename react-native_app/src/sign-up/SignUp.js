// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, Image, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput} from "react-native";
import {Button, Header, Left, Right, Body, Icon, Title, Text} from "native-base";
import {Constants} from "expo";

import {Container, Images, Field, NavigationHelpers, Styles, SingleChoice, WindowDimensions} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class SignUp extends React.Component<ScreenProps<>> {

    username: TextInput;
    password: TextInput;

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

    @autobind
    signIn() {
        NavigationHelpers.reset(this.props.navigation, "Walkthrough");
    }

    render(): React.Node {
        return (
            <Container safe={true}>
                <Image source={Images.signUp} style={style.img} />
                <ScrollView style={Styles.flexGrow}>
                <KeyboardAvoidingView behavior="position">
                    <Header noShadow>
                        <Left>
                            <Button onPress={this.back} transparent>
                                <Icon name='close' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Sign Up</Title>
                        </Body>
                        <Right />
                    </Header>
                    <View style={style.row}>
                        <Button transparent block style={style.btn}>
                            <Icon name="logo-twitter" />
                            <Text style={{ textAlign: "center" }}>Connect with</Text>
                            <Text style={{ textAlign: "center" }}>Twitter</Text>
                        </Button>
                        <Button transparent block style={[style.btn, style.facebook]}>
                            <Icon name="logo-facebook" />
                            <Text style={{ textAlign: "center" }}>Connect with</Text>
                            <Text style={{ textAlign: "center" }}>Facebook</Text>
                        </Button>
                    </View>
                    <Button transparent block style={[style.btn, style.email]}>
                        <Icon name="ios-mail-outline" style={{ color: "white", marginRight: 5 }} />
                        <Text>or use your email address</Text>
                    </Button>
                    <View style={Styles.form}>
                        <Field
                            label="Name"
                            onSubmitEditing={this.goToUsername}
                            returnKeyType="next"
                        />
                        <Field
                            label="Username"
                            textInputRef={this.setUsernameRef}
                            onSubmitEditing={this.goToPassword}
                            returnKeyType="next"
                        />
                        <Field
                            label="Password"
                            secureTextEntry
                            textInputRef={this.setPasswordRef}
                            onSubmitEditing={this.signIn}
                            returnKeyType="go"
                        />
                        <Field label="Gender">
                            <SingleChoice labels={["Male", "Female"]} />
                        </Field>
                    </View>
                </KeyboardAvoidingView>
                </ScrollView>
                <Button primary block onPress={this.signIn} style={{ height: variables.footerHeight }}>
                    <Text>CONTINUE</Text>
                </Button>
            </Container>
        );
    }
}

const style = StyleSheet.create({
    img: {
        ...StyleSheet.absoluteFillObject,
        width: WindowDimensions.width,
        height: WindowDimensions.height - Constants.statusBarHeight,
        top: Constants.statusBarHeight
    },
    row: {
        flexDirection: "row"
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
