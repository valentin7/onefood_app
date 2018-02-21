// @flow
import * as React from "react";
import {Dimensions} from "react-native";
import {StyleProvider} from "native-base";
import {StackNavigator, DrawerNavigator} from "react-navigation";
import {Font, AppLoading} from "expo";
import {useStrict} from "mobx";

import {Images, Firebase} from "./src/components";
import {Login} from "./src/login";
import {SignUp} from "./src/sign-up";
import {Walkthrough} from "./src/walkthrough";
import {Drawer} from "./src/drawer";
import {Home} from "./src/home";
import {Calendar} from "./src/calendar";
import {Overview} from "./src/overview";
import {Groups} from "./src/groups";
import {Lists} from "./src/lists";
import {Pedidos} from "./src/pedidos";
import {Mapa} from "./src/mapa";
import {Comprar} from "./src/comprar";
import {Compartir} from "./src/compartir";
import {Nosotros} from "./src/nosotros";
import {Contacto} from "./src/contacto";
import {Informacion} from "./src/informacion";
import {Profile} from "./src/profile";
import {Timeline} from "./src/timeline";
import {Settings} from "./src/settings";
import {Create} from "./src/create";

import getTheme from "./native-base-theme/components";
import variables from "./native-base-theme/variables/commonColor";

const SFProTextBold = require("./fonts/SF-Pro-Text-Bold.otf");
const SFProTextSemibold = require("./fonts/SF-Pro-Text-Semibold.otf");
const SFProTextRegular = require("./fonts/SF-Pro-Text-Regular.otf");

type AppState = {
    staticAssetsLoaded: boolean,
    authStatusReported: boolean,
    isUserAuthenticated: boolean
};

export default class App extends React.Component<{}, AppState> {

    state: AppState = {
      staticAssetsLoaded: false,
      authStatusReported: false,
      isUserAuthenticated: false
    }

    componentWillMount() {
        const promises = [];
        Firebase.init();
        promises.push(
            Font.loadAsync({
                "Avenir-Book": require("./fonts/Avenir-Book.ttf"),
                "Avenir-Light": require("./fonts/Avenir-Light.ttf"),
                "SFProText-Bold": SFProTextBold,
                "SFProText-Semibold": SFProTextSemibold,
                "SFProText-Regular": SFProTextRegular
            })
        );
        Promise.all(promises.concat(Images.downloadAsync()))
            .then(() => this.setState({ staticAssetsLoaded: true }))
            // eslint-disable-next-line
            .catch(error => console.error(error));

        Firebase.auth.onAuthStateChanged(user => {
          this.setState({
            authStatusReported: true,
            isUserAuthenticated: !!user
          });
        });
    }

    render(): React.Node {
        const {staticAssetsLoaded, authStatusReported, isUserAuthenticated} = this.state;
        return <StyleProvider style={getTheme(variables)}>
            {
                (staticAssetsLoaded && authStatusReported) ?
                  (
                    isUserAuthenticated
                      ?
                        <AuthenticatedAppNavigator onNavigationStateChange={() => undefined}/>
                      :
                        <AppNavigator onNavigationStateChange={() => undefined} />
                  )
                :
                    <AppLoading startAsync={null} onError={null} onFinish={null} />
            }
        </StyleProvider>;
    }
}

useStrict(true);

const fade = (props) => {
    const {position, scene} = props

    const index = scene.index

    const translateX = 0
    const translateY = 0

    const opacity = position.interpolate({
        inputRange: [index - 0.7, index, index + 0.7],
        outputRange: [0.3, 1, 0.3]
    })

    console.log("fading");
    return {
        opacity,
        transform: [{translateX}, {translateY}]
    }
}


const MainNavigator = DrawerNavigator({
    Pedidos: {screen: Pedidos },
    Mapa: {screen: Mapa },
    Overview: { screen: Overview },
    Comprar: {screen: Comprar},
    Walkthrough: {screen: Walkthrough},
    Compartir: {screen: Compartir},
    Nosotros: {screen: Nosotros},
    Contacto: {screen: Contacto},
    Profile: { screen: Profile },
    Timeline: { screen: Timeline },
    Settings: { screen: Settings },
    Create: { screen: Create }
}, {
    drawerWidth: Dimensions.get("window").width,
    // eslint-disable-next-line flowtype/no-weak-types
    contentComponent: (Drawer: any),
    drawerBackgroundColor: variables.brandInfo,
    transitionConfig: () => ({
        screenInterpolator: (props) => {
            return fade(props)
        }
    })
});

const AuthenticatedAppNavigator = StackNavigator({
    Main: { screen: MainNavigator },
    Login: { screen: Login },
    SignUp: { screen: SignUp },
    Walkthrough: { screen: Walkthrough },
}, {
    headerMode: "none",
    cardStyle: {
        backgroundColor: variables.brandInfo
    }
});
const AppNavigator = StackNavigator({
    Login: { screen: Login },
    SignUp: { screen: SignUp },
    Walkthrough: { screen: Walkthrough },
    Main: { screen: MainNavigator }
}, {
    headerMode: "none",
    cardStyle: {
        backgroundColor: variables.brandInfo
    }
});

export {AppNavigator};
