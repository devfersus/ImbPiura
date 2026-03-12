export interface PropiedadFoto {
  propiedadDetalleFotosId: string;
  foto: string;
  activo: boolean;
  orden: number | null;
}

export interface PropiedadDetalle {
  propiedadListadoId: string;
  tipoPropiedadId: string;
  descripcionTipoPropiedad: string | null;
  tipoListadoId: string;
  descripcionTipoListado: string | null;
  titulo: string;
  descripcion: string;
  descripcionFinal: string | null;
  precio: number;
  fotos: PropiedadFoto[];
  contadorClicks: number;
  codigoPromocionId: number;
  descripcionPromocion: string | null;
  activo: boolean;
  departamentoId: number;
  descripcionDepartamento: string | null;
  areaTerreno: number | null;
  ubicacion: string | null;
  orden: number | null;
}

export interface PropiedadAgrupada {
  propiedadListadoId: string;
  slug: string;
  titulo: string;
  descripcion: string;
  descripcionFinal: string | null;
  precio: number;
  fotos: string[];
  fotoPortada: string;
  descripcionTipoPropiedad: string | null;
  descripcionTipoListado: string | null;
  descripcionDepartamento: string | null;
  descripcionPromocion: string | null;
  activo: boolean;
  areaTerreno: number | null;
  ubicacion: string | null;
}

export interface Testimonio {
  nombre: string;
  edad: number;
  comentario: string;
  foto: string;
}
