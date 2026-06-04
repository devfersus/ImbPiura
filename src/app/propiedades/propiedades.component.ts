import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppService } from '../home/app.service';
import { PropiedadDetalle, PropiedadAgrupada } from '../home/models/property.component';

@Component({
  selector: 'app-propiedades',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropiedadesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appService = inject(AppService);

  cargando = signal(true);

  filtroTipo = signal('');
  filtroListado = signal('');
  ordenPrecio = signal<'asc' | 'desc' | ''>('');

  propiedadesPagina = signal<PropiedadAgrupada[]>([]);
  paginaActual = signal(1);
  totalPaginas = signal(1);
  totalResultados = signal(0);

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  tiposPropiedad = computed(() =>
    [...new Set(
      this.propiedadesPagina()
        .map(p => p.descripcionTipoPropiedad)
        .filter((v): v is string => !!v)
    )]
  );

  tiposListado = computed(() =>
    [...new Set(
      this.propiedadesPagina()
        .map(p => p.descripcionTipoListado)
        .filter((v): v is string => !!v)
    )]
  );

  propiedadesOrdenadas = computed(() => {
    const lista = this.propiedadesPagina();
    const orden = this.ordenPrecio();
    if (!orden) return lista;
    return [...lista].sort((a, b) =>
      orden === 'asc' ? (a.precio ?? 0) - (b.precio ?? 0) : (b.precio ?? 0) - (a.precio ?? 0)
    );
  });

  propiedadesFiltradas = computed(() => {
    let lista = this.propiedadesOrdenadas();
    const tipo = this.filtroTipo();
    const listado = this.filtroListado();
    if (tipo) lista = lista.filter(p => p.descripcionTipoPropiedad === tipo);
    if (listado) lista = lista.filter(p => p.descripcionTipoListado === listado);
    return lista;
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filtroTipo.set(params['tipo'] || '');
      this.filtroListado.set(params['listado'] || '');
      this.cargarPagina(1);
    });
  }

  filtrar(tipo: string, listado: string, orden: string) {
    const queryParams: Record<string, string> = {};
    if (tipo) queryParams['tipo'] = tipo;
    if (listado) queryParams['listado'] = listado;
    this.ordenPrecio.set(orden as 'asc' | 'desc' | '');
    this.router.navigate(['/propiedades'], { queryParams });
  }

  irAPagina(pagina: number) {
    this.cargarPagina(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private cargarPagina(pagina: number) {
    this.cargando.set(true);
    const tieneFiltros = !!(this.filtroTipo() || this.filtroListado());

    if (tieneFiltros) {
      this.appService.obtenerTodasLasPropiedades().subscribe({
        next: (items: PropiedadDetalle[]) => {
          this.propiedadesPagina.set(items.map(p => this.mapearPropiedad(p)));
          this.totalPaginas.set(1);
          this.totalResultados.set(items.length);
          this.paginaActual.set(1);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al cargar propiedades', err);
          this.cargando.set(false);
        }
      });
    } else {
      this.appService.obtenerPropiedadesActivasPaginadas(pagina).subscribe({
        next: (data) => {
          this.propiedadesPagina.set(data.items.map((p: PropiedadDetalle) => this.mapearPropiedad(p)));
          this.totalPaginas.set(data.totalPaginas);
          this.totalResultados.set(data.totalRegistros);
          this.paginaActual.set(data.numeroPagina);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al cargar propiedades', err);
          this.cargando.set(false);
        }
      });
    }
  }

  private mapearPropiedad(item: PropiedadDetalle): PropiedadAgrupada {
    const fotos = item.fotos
      ?.filter(f => f.activo)
      .sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999))
      .map(f => f.foto)
      .filter(Boolean) ?? [];
    return {
      propiedadListadoId: item.propiedadListadoId,
      slug: this.appService.slugify(item.titulo),
      titulo: item.titulo,
      descripcion: item.descripcion,
      descripcionFinal: item.descripcionFinal,
      precio: item.precio,
      tipoMoneda: item.tipoMoneda ?? 'S/.',
      fotos,
      fotoPortada: fotos[0] ?? '',
      descripcionTipoPropiedad: item.descripcionTipoPropiedad,
      descripcionTipoListado: item.descripcionTipoListado,
      descripcionDepartamento: item.descripcionDepartamento,
      descripcionPromocion: item.descripcionPromocion,
      activo: item.activo,
      areaTerreno: item.areaTerreno,
      ubicacion: item.ubicacion,
    };
  }
}
