import { UserCredentials,UserResponse,UserCredentialsBuscar,BuscarColaboradorResponse,
  CrearUsuarioDTO,CrearUsuarioResponse,RolUsuario
 } from '../../models/userModelos';

export interface UserRepositorio {
  LoginUser(Login: UserCredentials): Promise<UserResponse>;
  BuscarUser(userBuscar: UserCredentialsBuscar): Promise<BuscarColaboradorResponse>;
  CrearUsuario(crearUsario: CrearUsuarioDTO): Promise<CrearUsuarioResponse>;
  RolesActivos(): Promise<RolUsuario[]>;
}

