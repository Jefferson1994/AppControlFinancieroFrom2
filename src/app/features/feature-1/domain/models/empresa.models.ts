export interface EmpresasInterfas {
  id: number;
  nombre: string;
  ruc: string;
  codigo_establecimiento: string;
  descripcion: string;
  activo: number;
  id_tipo_empresa: number;
  id_datos_contacto: number;
  direccion: string;
  horario_apertura: string;
  horario_cierre: string;
  id_administrador: number;
  creado_en: string;
  datosContactoEmpresa: DatosContactoEmpresa;
  tipoEmpresa: TipoEmpresa;
}

export interface DatosContactoEmpresa {
  id: number;
  telefono_contacto: string;
  email_contacto: string;
  ciudad: string;
  provincia: string;
  pais: string;
  latitud: number;
  longitud: number;
}

export interface TipoEmpresa {
  id: number;
  nombre: string;
  descripcion: string;
  activo: number;
}

export interface CrearEmpresaDTO {
  nombre: string;
  ruc: string;
  descripcion: string;
  id_tipo_empresa: number;
  direccion: string;
  horario_apertura: string;
  horario_cierre: string;
  datos_contacto: {
    telefono_contacto: string;
    email_contacto: string;
    ciudad: string;
    provincia: string;
    pais: string;
    latitud: number;
    longitud: number;
  };
}
export interface CrearEmpresaResponse {
  mensaje: string;
  empresa: {
    nombre: string;
    ruc: string;
    descripcion: string;
    id_tipo_empresa: number;
    direccion: string;
    horario_apertura: string;
    horario_cierre: string;
    id_administrador: number;
    id_datos_contacto: number;
    datosContactoEmpresa: {
      telefono_contacto: string;
      email_contacto: string;
      ciudad: string;
      provincia: string;
      pais: string;
      latitud: number;
      longitud: number;
      id: number;
    };
    id: number;
    codigo_establecimiento: string;
    activo: number;
    creado_en: string;
  };
}

export interface CrearProductoDTO {
  nombre: string;
  descripcion: string;
  precio_venta: number;
  precio_promocion: number | null;
  precio_descuento: number | null;
  stock_actual: number;
  id_negocio: number;
  id_tipo_producto: number;
}

export interface CrearProductoResponse {
  mensaje: string;
  producto: {
    nombre: string;
    descripcion: string;
    precio_venta: number;
    precio_promocion: number;
    precio_descuento: number;
    stock_actual: number;
    id_negocio: number;
    id_tipo_producto: number;
    id: number;
    activo: number;
  };
}

export interface CrearServicioDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  precio_descuento: number | null;
  porcentaje_descuento: number | null;
  porcentaje_comision_colaborador: number;
  activo?: number; // El '?' indica que la propiedad es opcional
  id_negocio: number;
  id_tipo_servicio: number;
  duracion_minutos: number;
}

export interface CrearServicioResponse {
  mensaje: string;
  servicio: {
    nombre: string;
    descripcion: string;
    precio: number;
    precio_descuento: number | null;
    porcentaje_descuento: number | null;
    id_negocio: number;
    id_tipo_servicio: number;
    duracion_minutos: number;
    activo: number | null;
    id: number;
    porcentaje_comision_colaborador: number;
  };
}

export interface AgregarColaboradorDTO {
  id_negocio: number;
  id_usuario: number;
  codigo_punto_emision_movil: string;
}

export interface AgregarColaboradorResponse {
  mensaje: string;
  empleado: {
    id_usuario: number;
    id_negocio: number;
    codigo_punto_emision_movil: string;
    activo: boolean;
    id: number;
    porcentaje_ganancia: number;
  };
}
