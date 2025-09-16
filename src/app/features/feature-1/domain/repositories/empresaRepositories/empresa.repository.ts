import { EmpresasInterfas,CrearEmpresaDTO,CrearEmpresaResponse,
  CrearProductoDTO,CrearProductoResponse,CrearServicioDTO,CrearServicioResponse,
  AgregarColaboradorDTO,
  AgregarColaboradorResponse} from '../../models/empresa.models';

export interface empresaRepositorio {
  todasEmpresasXAdmin(idAdministrador: number,token: string): Promise<EmpresasInterfas[]>;
  CrearEmpresa(empresa: CrearEmpresaDTO): Promise<CrearEmpresaResponse>;
  CrearProducto(producto: CrearProductoDTO): Promise<CrearProductoResponse>;
  CrearServicio(producto: CrearServicioDTO): Promise<CrearServicioResponse>;
  AgregarColaborador(AgregarColaborador: AgregarColaboradorDTO): Promise<AgregarColaboradorResponse>;
  todasEmpresasXID(idEmpresa: number): Promise<EmpresasInterfas>;
}

