
export type PedidoModel = {
  pedido_id: string,
  fecha: string,
  cantidades: [number],
  sabores: [string],
  precio_total: number,
  user_id: string,
  subscription: boolean,
  direccion: string,
};
