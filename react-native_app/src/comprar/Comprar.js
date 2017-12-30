// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, InteractionManager, Animated} from "react-native";
import {H1, Text, Button} from "native-base";
import ImageSlider from 'react-native-image-slider';
import {BaseContainer, TaskOverview, Images, Styles, PrecioTotal, JankWorkaround} from "../components";
import type {ScreenProps} from "../components/Types";
import Modal from 'react-native-modalbox';
import {StackNavigator, StackRouter} from 'react-navigation';

import variables from "../../native-base-theme/variables/commonColor";

export default class Comprar extends React.Component {
    static router = ComprarRouter;

    state = {
      loading: true,
      fadeAnim: new Animated.Value(1),
      shouldUpdate: false,
    }

    componentWillMount() {
      this.setState({shouldUpdate: true});
    }

    componentDidMount() {
      JankWorkaround.runAfterInteractions(() => {
      //   Animated.timing(                  // Animate over time
      //   this.state.fadeAnim,            // The animated value to drive
      //   {
      //     toValue: 1,                   // Animate to opacity: 1 (opaque)
      //     duration: 50,              // Make it take a while
      //   }
      // ).start();                        // Starts the animation
        this.setState({ loading: false });
      });
    }

    componentWillUnmount() {
      this.setState({shouldUpdate: false});
      Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 100,              // Make it take a while
      }
    ).start();                        // Starts the animation
    }

    open() {
      this.refs.modal2.open();
    }

    static navigationOptions = {
      title: 'Welcome',
    };

    render(): React.Node {
        const today = moment();

        let { fadeAnim } = this.state.fadeAnim;
        return <Modal style={[style.modal, style.modal2]} backdrop={false} position={"top"} ref={"modal2"}>
            <Image source={Images.music} style={style.img} />
            <PrecioTotal sabor={"Chocolate"} cantidad={1} total={50} />
            <PrecioTotal sabor={"Vainilla"} cantidad={1} total={50} />
            <PrecioTotal sabor={"PEDIR"} cantidad={50} total={50} />
            <View style={style.row}>
                  <H1 style={style.heading}>{`$50`}</H1>
                  <Text style={Styles.grayText}>TOTAL</Text>
            </View>

        </Modal>;
    }
}

class DetallesScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.name,
  });
  render() {
    const { goBack } = this.props.navigation;
    return (
      <Button
        title="Go back"
        onPress={() => goBack()}
      />
    );
  }
}

const ComprarRouter = StackRouter({
  Comprar: {screen: Comprar},
  Detalles: {screen: DetallesScreen},
}, {
  initialRouteName: 'Comprar',
});



/*<ImageSlider images={[
     Images.music,
     Images.travel
 ]}/>*/
const Loading = () => (
  <View style={style.container}>
    <Text>Loading...</Text>
  </View>
);

const {width} = Dimensions.get("window");
const style = StyleSheet.create({
    img: {
        width,
        height: width * 500 / 750,
        resizeMode: "cover"
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
        flex: 1,
        flexDirection: "row",
        borderColor: variables.listBorderColor,
        borderBottomWidth: variables.borderWidth,
        alignItems: 'center',
    },
    column: {
      flex: 1,
      flexDirection: "column",
      borderColor: variables.listBorderColor,
      borderBottomWidth: variables.borderWidth
    },
    itemContainer: {
        flex: 1
    },
    priceContainer: {
        flexDirection: "row",
        borderTopWidth: variables.borderWidth,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    leftCell: {
        borderRightWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },
    count: {
        flex: .5,
        padding: variables.contentPadding * 2
    },
    heading: {
        color: "white"
    },
    modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal2: {
    backgroundColor: "#3B5998"
  },
});
