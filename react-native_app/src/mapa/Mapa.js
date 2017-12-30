// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {ScrollView, InteractionManager, StyleSheet, View, Dimensions, Text, Animated} from "react-native";
import {Icon, Picker} from "native-base";
import MapView from "react-native-maps";
import {observable, action} from "mobx";
import { observer } from "mobx-react/native";

import {BaseContainer, Task, JankWorkaround} from "../components";
import type {ScreenProps} from "../components/Types";

const now = moment();

@observer
export default class Mapa extends React.Component<ScreenProps<>> {

    @observable selectedMonth: number;
    @observable selectedDate: Date;

    state = {
      loading: true,
      fadeAnim: new Animated.Value(1),
      shouldUpdate: false,
    }

    constructor() {
        super();
        const month = now.month();
        const day = now.date();
        this.selectedMonth = month;
        this.selectedDate = { month, day };
    }

    componentWillMount() {
      this.setState({shouldUpdate: true});
    }

    componentDidMount() {
      JankWorkaround.runAfterInteractions(() => {
        this.setState({ loading: false });
      });
    }

    shouldComponentUpdate() {
      return this.state.shouldUpdate
    }

    componentWillUnmount() {
      this.setState({shouldUpdate: false});
      // console.log("coming out of map");
        Animated.timing(                  // Animate over time
        this.state.fadeAnim,            // The animated value to drive
        {
          toValue: 0,                   // Animate to opacity: 1 (opaque)
          duration: 300,              // Make it take a while
        }
      ).start();                        // Starts the animation
    }

    @autobind @action
    onChangeDate (date: Date) {
        this.selectedDate = date;
    }

    render(): React.Node {
        let { fadeAnim } = this.state.fadeAnim;
        const {navigation} = this.props;
        const title = "ONEFOOD";
        const { width, height } = Dimensions.get('window');
        const ratio = width / height;
        const coordinates = {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922 * ratio,
        };

        return <BaseContainer {...{ navigation, title }}>
                <View style={styles.container}>
                 {this.state.loading ? (
                   <Loading />
                 ) : (
                   <MapView
                     style={styles.map}
                     initialRegion={coordinates}
                   />
                 )}
                </View>
                <Animated.View style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              opacity: fadeAnim
                            }}>
                          <Text>Hey</Text>
                </Animated.View>
             </BaseContainer>;
    }
}


const Loading = () => (
  <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
);

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
// });

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 900,
  },
  map: {
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
   },
});
