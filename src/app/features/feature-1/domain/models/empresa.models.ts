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
  imagenes: ImagenEmpresa[];
}

export interface ImagenEmpresa {
  id: number;
  id_empresa: number;
  url_imagen: string;
  orden: number;
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
    direccion: string;

  };
}

export interface ActualizarrEmpresaDTO {
  nombre: string;
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
    urlImagen:string;
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
  precio_comprar: number;
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

export interface TipoProducto {
  id: number;
  nombre: string;
  descripcion: string;
  activo: number;
}

// Interfaz para el objeto principal 'Producto'
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  precio_promocion: number;
  precio_descuento: number;
  stock_actual: number;
  id_negocio: number;
  id_tipo_producto: number;
  activo: number;
  tipoProducto: TipoProducto; // <-- Aquí se anida la interfaz anterior
}

// Interfaz para la respuesta completa de la API
export interface RespuestaProductos {
  mensaje: string;
  productos: Producto[]; // Un arreglo de la interfaz Producto
}


export interface EstadisticasInventario {
  valorTotalInventario: number;
  totalProductos: number;
  productosConPocoStock: number;
  gananciaPotencial: number;
}

//servicios interfas

export interface TipoServicio {
  id: number;
  nombre: string;
  descripcion: string;
  activo: number;
}

export interface Servicios {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_descuento: number;
  porcentaje_descuento: number;
  id_negocio: number;
  id_tipo_servicio: number;
  duracion_minutos: number;
  id_tipo_producto: number;
  porcentaje_comision_colaborador: number;
  activo: number;
  tipoServicio: TipoServicio; // <-- Aquí se anida la interfaz anterior
}
export interface RespuestaServicios {
  mensaje: string;
  servicios: Servicios[]; // Un arreglo de la interfaz Producto
}





