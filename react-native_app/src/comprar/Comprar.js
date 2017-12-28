// @flow
import moment from "moment";
import * as React from "react";
import {View, Image, StyleSheet, Dimensions, InteractionManager} from "react-native";
import {H1, Text, Button} from "native-base";
import ImageSlider from 'react-native-image-slider';
import {BaseContainer, TaskOverview, Images, Styles, PrecioTotal} from "../components";
import type {ScreenProps} from "../components/Types";

import variables from "../../native-base-theme/variables/commonColor";

export default class Profile extends React.Component<ScreenProps<>> {

    state = {
    loading: true,
    }

    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ loading: false });
      });
    }

    render(): React.Node {
        const today = moment();
        return <BaseContainer title="Comprar" navigation={this.props.navigation} scrollable>

            <View>
             {this.state.loading ? (
               <Loading />
             ) : (
               <ImageSlider images={[
                   Images.music,
                   Images.travel
               ]}/>
             )}
           </View>

            <PrecioTotal cantidad={1} total={50} />
        </BaseContainer>;
    }
}


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
        borderBottomWidth: variables.borderWidth
    },
    column: {
      flex: 1,
      flexDirection: "column",
      borderColor: variables.listBorderColor,
      borderBottomWidth: variables.borderWidth
    },
    itemContainer: {
        flex: 1
    }
});
