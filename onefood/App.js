import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  TabNavigator,
} from 'react-navigation';

export const BasicApp = TabNavigator({
  Comprar: {
    screen: ComprarScreen.js,
    path: '/',
  },
  Pedidos: {
    screen: PedidosScreen.js,
    path: '/pedidos',
  },
})

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>ONEFOOD</Text>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
