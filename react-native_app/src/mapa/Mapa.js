// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {ScrollView, Platform, InteractionManager, StyleSheet, View, Dimensions, Animated, Switch, Alert, Image} from "react-native";
import {Icon, Button, Picker, H3, Card, CardItem, Text, Body, Container} from "native-base";
import MapView, {Marker, Circle} from "react-native-maps";
import {observable, action} from "mobx";
import { Constants, Location, Permissions } from 'expo';
import openMap from 'react-native-open-maps';
import variables from "../../native-base-theme/variables/commonColor";
import Modal from 'react-native-modalbox';
import Autolink from "react-native-autolink";

import {BaseContainer, Task, JankWorkaround, Firebase, Images, MapaComponent} from "../components";
import type {ScreenProps} from "../components/Types";
import { observer, inject } from "mobx-react/native";

@inject('store') @observer
export default class Mapa extends React.Component<ScreenProps<>> {

    state = {
      loading: true,
      fadeAnim: new Animated.Value(1),
      shouldUpdate: false,
      markers: [],
      compartiendoUbicacion: false,
      userLocation: null,
      coordsToOpen: null,
      repInfoModalVisible: false,
      nameOfRepToShow: "",
      phoneOfRepToShow: "",
    }

    componentWillUnmount() {
      this.setState({shouldUpdate: false});
    }

    @autobind
    refreshLocationsInMap() {
      this.child.refreshLocationsInMap();
      //this.refs.mapaComponent.refreshLocationsInMap();
    }

    @autobind
    updateLocationSharing(value) {
      this.child.updateLocationSharing(value);
      //this.refs.mapaComponent.updateLocationSharing(value);
    }

    render(): React.Node {
        let { fadeAnim } = this.state.fadeAnim;
        const {navigation} = this.props;
        const title = "ONEFOOD";

        return <BaseContainer {...{ navigation, title }}  hasRefresh={true} refresh={this.refreshLocationsInMap}>
                {
                  this.props.store.esRep &&
                  <Card>
                   <CardItem>
                     <Body>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                       <Text style={{color: 'gray', marginRight: 30}}>
                         Compartir ubicación en el mapa
                       </Text>
                       <Switch value={this.props.store.showingLocationOnMap} onValueChange={this.updateLocationSharing} />
                       </View>
                     </Body>
                   </CardItem>
                 </Card>
                }
                <Card>
                   <Body style={{marginVertical: 10}}>
                     <Text style={{color: 'gray'}}>
                       Pasa por tu ONEFOOD a la locación más cercana.
                     </Text>
                   </Body>
               </Card>
               <MapaComponent onRef={ref => (this.child = ref)} principal={true}/>
             </BaseContainer>;
    }
}

const Loading = () => (
  <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
);

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: height - 250,
  },
});
