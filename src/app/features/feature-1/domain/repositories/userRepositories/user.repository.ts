import { UserCredentials,UserResponse,UserCredentialsBuscar,BuscarColaboradorResponse,
  CrearUsuarioDTO,CrearUsuarioResponse,RolUsuario,
  ValidacionRequest,
  ValidacionResponse
 } from '../../models/userModelos';

export interface UserRepositorio {
  LoginUser(Login: UserCredentials): Promise<UserResponse>;
  BuscarUser(userBuscar: UserCredentialsBuscar): Promise<BuscarColaboradorResponse>;
  CrearUsuario(crearUsario: CrearUsuarioDTO): Promise<CrearUsuarioResponse>;
  RolesActivos(): Promise<RolUsuario[]>;
  BuscarCiudadano(userBuscar: ValidacionRequest): Promise<ValidacionResponse>
}

