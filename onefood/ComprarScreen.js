class ComprarScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Comprar',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Ir a Pedidos"
        onPress={() => navigate('Pedidos')}
      />
    );
  }
}
