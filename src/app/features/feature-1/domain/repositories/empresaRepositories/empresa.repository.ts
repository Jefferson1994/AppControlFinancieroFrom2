import { EmpresasInterfas,CrearEmpresaDTO,CrearEmpresaResponse,
  CrearProductoDTO,CrearProductoResponse,CrearServicioDTO,CrearServicioResponse,
  AgregarColaboradorDTO,
  AgregarColaboradorResponse,
  ActualizarrEmpresaDTO,
  RespuestaProductos,
  EstadisticasInventario, RespuestaServicios,
  TipoProducto,
  TipoServicio,
  TipoEmpresa,
  RespuestaColaboradores,
  RespuestaDesvincular,
  buscarempresaPorUbicacionDTO} from '../../models/empresa.models';

export interface empresaRepositorio {
  todasEmpresasXAdmin(idAdministrador: number,token: string): Promise<EmpresasInterfas[]>;
  CrearEmpresa(empresa: FormData): Promise<CrearEmpresaResponse>;
  //CrearProducto(producto: CrearProductoDTO): Promise<CrearProductoResponse>;
  CrearProducto(producto: FormData): Promise<CrearProductoResponse>
  //CrearServicio(producto: CrearServicioDTO): Promise<CrearServicioResponse>;
  CrearServicio(servicio: FormData): Promise<CrearServicioResponse>
  AgregarColaborador(AgregarColaborador: AgregarColaboradorDTO): Promise<AgregarColaboradorResponse>;
  todasEmpresasXID(idEmpresa: number): Promise<EmpresasInterfas>;
  actualizarEmpresa(empresa: ActualizarrEmpresaDTO,idEmpresa:number): Promise<CrearEmpresaResponse>;
  ListaProductosXEmpresa(idEmpresa: number): Promise<RespuestaProductos>;
  ListaEstadisticasXEmpresa(idEmpresa: number): Promise<EstadisticasInventario>
  ListaServicioXEmpresa(idEmpresa: number): Promise<RespuestaServicios>
  ListarTiposProductosXEmpresa(tipoEmpresa: number): Promise<TipoProducto[]>
  ListarTiposServiciosXEmpresa(tipoEmpresa: number): Promise<TipoServicio[]>
  ListarTiposEmpresa(): Promise<TipoEmpresa[]>
  ListaTodosColaboradoresXEmpresa(idEmpresa: number): Promise<RespuestaColaboradores>
  desvincularColaboradoresXEmpresa(idEmpresa: number,id_usuario: number): Promise<RespuestaDesvincular>
  vacacionesColaboradoresXEmpresa(idEmpresa: number,id_usuario: number): Promise<RespuestaDesvincular>
  IntegrarvacacionesColaboradoresXEmpresa(idEmpresa: number,id_usuario: number): Promise<RespuestaDesvincular>
  obtenerEmpresasCercanas(BuscarEmpresas: buscarempresaPorUbicacionDTO): Promise<EmpresasInterfas[]>
}

