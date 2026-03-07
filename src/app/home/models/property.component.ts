export interface PropiedadDetalle {
  propiedadListadoId: string;
  tipoPropiedadId: string;
  descripcionTipoPropiedad: string | null;
  tipoListadoId: string;
  descripcionTipoListado: string | null;
  titulo: string;
  descripcion: string;
  precio: number;
  foto: string;
  contadorClicks: number;
  codigoPromocionId: number;
  descripcionPromocion: string;
  activo: boolean;
  departamentoId: number;
  descripcionDepartamento: string | null;
}

export interface PropiedadDetallePaginado {
  items: PropiedadDetalle[];
  totalRegistros: number;
  totalPaginas: number;
  numeroPagina: number;
}

export interface PropiedadAgrupada {
  titulo: string;
  descripcion: string;
  precio: number;
  fotos: string[];
  fotoPortada: string;
  descripcionTipoPropiedad: string | null;
  descripcionTipoListado: string | null;
  descripcionDepartamento: string | null;
  descripcionPromocion: string;
  activo: boolean;
}

export interface Testimonio {
  nombre: string;
  edad: number;
  comentario: string;
  foto: string;
}
