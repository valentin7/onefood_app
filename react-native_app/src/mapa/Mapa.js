// @flow
import autobind from "autobind-decorator";
import moment from "moment";
import * as React from "react";
import {ScrollView, Platform, InteractionManager, StyleSheet, View, Dimensions, Animated, Switch, Alert} from "react-native";
import {Icon, Picker, H3, Card, CardItem, Text, Body, Container} from "native-base";
import MapView, {Marker} from "react-native-maps";
import {observable, action} from "mobx";
import { Constants, Location, Permissions } from 'expo';
import openMap from 'react-native-open-maps';
import variables from "../../native-base-theme/variables/commonColor";

import {BaseContainer, Task, JankWorkaround, Firebase} from "../components";
import type {ScreenProps} from "../components/Types";
import { observer, inject } from "mobx-react/native";

const now = moment();

var markerId = 2;
let userId = "";
let localUserId = "";

@inject('store') @observer
export default class Mapa extends React.Component<ScreenProps<>> {

    @observable selectedMonth: number;
    @observable selectedDate: Date;

    state = {
      loading: true,
      fadeAnim: new Animated.Value(1),
      shouldUpdate: false,
      markers: [],
      compartiendoUbicacion: false,
      userLocation: null,
    }
    //{key: markerId++, title: "Camión ONEFOOD #23", description: "Presiona para abrir en Mapa.", coordinate: {latitude: 19.4326, longitude: -99.1335}, color: "green"},
              //{key: markerId++, title: "Camión ONEFOOD #2", description: "Presiona para abrir en Mapa.", coordinate: {latitude: 19.4452, longitude: -99.1359}, color: "green"}

    constructor() {
        super();
        const month = now.month();
        const day = now.date();
        this.selectedMonth = month;
        this.selectedDate = { month, day };
    }

    componentWillMount() {
      userId = Firebase.auth.currentUser.uid;
      localUserId = userId + "local";

      if (! this.props.store.showingLocationOnMap) {
          this.removeSelfLocationIfExists();
      }


      this.updateLocationSharing(this.props.store.showingLocationOnMap);
      //this.setState({shouldUpdate: true});
    }

    componentDidMount() {
      //this.setState({ loading: false });
      JankWorkaround.runAfterInteractions(() => {
        this.setState({ loading: false });
      });

      this.refreshLocationsInMap();
      // this.updateLocation();

    }

    @autobind
    openMapMarker(coordinate) {
      openMap({latitude: coordinate.latitude, longitude: coordinate.longitude});
    }

    componentWillUnmount() {
      this.setState({shouldUpdate: false});
    }

    @autobind
    updateLocationSharing(value) {
      //this.setState({compartiendoUbicacion: value});
      this.props.store.showingLocationOnMap = value;

      if (value) {
        this.updateLocation();
        this.showUserLocationOnMap();
      } else {
        this.removeUserLocationFromMap();
      }
    }

    @autobind
    async refreshLocationsInMap(): Promise<void> {

      var newMarkers = [];
      const query = await Firebase.firestore.collection("mapalocations").get().then((querySnapshot) => {

        var showingLocOnMap = this.props.store.showingLocationOnMap;
        var userLoc = this.props.store.userLocationOnMap;
        console.log("userloc bro ", userLoc);
        querySnapshot.forEach((doc) => {
          var locData = doc.data();
          if (locData.key != userId) {
            console.log("ADDDDing one w id ", locData.key);
            console.log("heyy ", locData);
            newMarkers.push({key: locData.key, title: locData.title, description: locData.description,  coordinate: {latitude: locData.coordinate.latitude, longitude: locData.coordinate.longitude}, color: locData.color});
            //newMarkers.push({key: userId, title: locData.title, description: locData.description,  coordinate: locData.coordinate, color: variables.brandPrimary});
          }
        });

        if (showingLocOnMap) {
          console.log("HERE BC SHOULD SHOW AND ", showingLocOnMap);
          newMarkers.unshift({key: localUserId, title: "Tú", description: "Compradores te pueden encontrar en el mapa.",  coordinate: {latitude: userLoc.coords.latitude, longitude: userLoc.coords.longitude}, color: variables.brandPrimary});
        }
        this.setState({markers: newMarkers});
        this.props.store.mapMarkers = newMarkers;
        console.log("newmarkers locations we got: ", newMarkers);
      });
    }

    @autobind
    removeSelfLocationIfExists() {
        var newMarkers = this.state.markers;
        for (var i = 0; i < newMarkers.length; i++) {
          var marker = newMarkers[i];
          if (marker["key"] == userId) {
            newMarkers.splice(i, 1);
          }
        }
      this.setState({markers: newMarkers});
    }

    @autobind
    async showUserLocationOnMap(): Promise<void> {
      var newMarkers = this.state.markers;
      var lat = this.props.store.userLocationOnMap["coords"]["latitude"];
      var lng = this.props.store.userLocationOnMap["coords"]["longitude"];
      this.removeSelfLocationIfExists();
      newMarkers.unshift({key: localUserId, title: "Tú", description: "Compradores te pueden encontrar en el mapa.", coordinate: {latitude: lat, longitude: lng}, color: variables.brandPrimary});
      //newMarkers.push({key: markerId++, title: "Tú Nuevo", description: "Compradores te pueden encontrar en el mapa.", coordinate: {latitude: 19.4323, longitude: -99.1331}, color: variables.brandPrimary});
      this.setState({markers: newMarkers});
      this.props.store.mapMarkers = newMarkers;
      var newLocation = {key: userId, title: "ONEFOOD REP Lorenzo", description: "Presiona para abrir locación en Mapa.", coordinate: {latitude: lat, longitude: lng}, color: "green"};
      await Firebase.firestore.collection("mapalocations").doc(userId).set(newLocation).then(function() {
          console.log("Puso location del usuario updated");
      })
      .catch(function(error) {
          console.error("Error al agregar el usuario al mapa: ", error.message);
      });
    }

    @autobind
    async updateLocation(): Promise<void> {
      if (Platform.OS === 'android' && !Constants.isDevice) {
       Alert.alert("Error", "Oops, this will not work on Sketch in an Android emulator. Try it on your device!");
     } else {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          Alert.alert("Permiso para accesar ubicación negada", "Para una mejor experiencia con el mapa, por favor de permitir acceso a ubicación en configuración del dispositivo.")
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
          this.props.store.showingLocationOnMap = false;
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({userLocation: location});
        this.props.store.userLocationOnMap = location;
        //this.forceUpdate()
        console.log("FORnew locochon: ", location);
      }
    }

    @autobind
    async removeUserLocationFromMap(): Promise<void> {
      var newMarkers = this.props.store.mapMarkers;//this.state.markers;
      if (newMarkers.length == 0) {
        return;
      }
      var firstMarker = newMarkers[0];
      // if the user's location was the most recently added location to the ONEFOOD map, simply remove it.
      if (firstMarker["key"] == localUserId) {
        newMarkers.splice(0, 1);
      } else {
        // if the user's location wasn't the most recently added in the ONEFOOD map.
        for (var i = 0; i < newMarkers.length; i++) {
          var marker = newMarkers[i];
          if (marker["key"] == localUserId) {
            newMarkers.splice(i, 1);
          }
        }
      }
      this.setState({markers: newMarkers});
      this.props.store.mapMarkers = newMarkers;

      // delete from the Firebase database too
      await Firebase.firestore.collection("mapalocations").doc(userId).delete()
      .then(function() {
          console.log("Deleted location del usuario success");
      })
      .catch(function(error) {
          console.error("Error removing usuario del mapa: ", error.message);
      });
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

        var lat = 19.4171;
        var lng = -99.1335;

        if (this.props.store.userLocationOnMap != undefined) {
          lat = this.props.store.userLocationOnMap["coords"]["latitude"];
          lng = this.props.store.userLocationOnMap["coords"]["longitude"];
        }

        var coordinates = {
          latitude: lat - 0.02,
          longitude: lng,
          latitudeDelta: 0.098,
          longitudeDelta: 0.098 * ratio,
        };

        return <BaseContainer {...{ navigation, title }}>
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
                 <CardItem>
                   <Body>
                     <Text style={{color: 'gray'}}>
                       Pasa por tu ONEFOOD a la locación más cercana.
                     </Text>
                   </Body>
                 </CardItem>
               </Card>
                <View style={styles.container}>
                 {this.state.loading ? (
                   <Loading />
                 ) : (
                   <MapView
                     style={styles.map}
                     initialRegion={coordinates}>
                     {this.props.store.mapMarkers.map(marker => (
                        <Marker
                          key={marker.key}
                          title={marker.title}
                          description={marker.description}
                          coordinate={marker.coordinate}
                          pinColor={marker.color}
                          onCalloutPress={() => this.openMapMarker(marker.coordinate)}
                        />
                      ))}
                    </MapView>
                 )}
                </View>
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
    height: 900,
  },
  map: {
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     zIndex: -1,
   }
});
