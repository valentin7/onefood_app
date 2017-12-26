class PedidosScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Pedidos',
  };
  render() {
    const { goBack } = this.props.navigation;
    return (
      <Button
        title="Go back to Comprar tab"
        onPress={() => goBack()}
      />
    );
  }
}
