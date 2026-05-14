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

  private todasPropiedades = signal<PropiedadDetalle[]>([]);
  cargando = signal(true);

  filtroTipo = signal('');
  filtroListado = signal('');
  filtroDepartamento = signal('');

  tiposPropiedad = computed(() =>
    [...new Set(
      this.todasPropiedades()
        .map(p => p.descripcionTipoPropiedad)
        .filter((v): v is string => !!v)
    )]
  );

  tiposListado = computed(() =>
    [...new Set(
      this.todasPropiedades()
        .map(p => p.descripcionTipoListado)
        .filter((v): v is string => !!v)
    )]
  );

  departamentos = computed(() =>
    [...new Set(
      this.todasPropiedades()
        .map(p => p.descripcionDepartamento)
        .filter((v): v is string => !!v)
    )]
  );

  private propiedadesFiltradas = computed(() => {
    const tipo = this.filtroTipo();
    const listado = this.filtroListado();
    const departamento = this.filtroDepartamento();
    return this.todasPropiedades().filter(p => {
      const matchTipo = !tipo || p.descripcionTipoPropiedad === tipo;
      const matchListado = !listado || p.descripcionTipoListado === listado;
      const matchDep = !departamento || p.descripcionDepartamento === departamento;
      return p.activo && matchTipo && matchListado && matchDep;
    });
  });

  private propiedadesAgrupadas = computed(() =>
    this.propiedadesFiltradas().map(p => this.mapearPropiedad(p))
  );

  readonly ITEMS_POR_PAGINA = 9;
  paginaActual = signal(1);

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.propiedadesAgrupadas().length / this.ITEMS_POR_PAGINA))
  );

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  propiedadesPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.ITEMS_POR_PAGINA;
    return this.propiedadesAgrupadas().slice(inicio, inicio + this.ITEMS_POR_PAGINA);
  });

  totalResultados = computed(() => this.propiedadesAgrupadas().length);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filtroTipo.set(params['tipo'] || '');
      this.filtroListado.set(params['listado'] || '');
      this.filtroDepartamento.set(params['departamento'] || '');
      this.paginaActual.set(1);
    });

    this.appService.listarPropiedadDetalle(1, 1000).subscribe({
      next: (data) => {
        this.todasPropiedades.set(this.appService.extractItems(data));
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar propiedades', err);
        this.cargando.set(false);
      }
    });
  }

  filtrar(tipo: string, listado: string, departamento: string) {
    const queryParams: Record<string, string> = {};
    if (tipo) queryParams['tipo'] = tipo;
    if (listado) queryParams['listado'] = listado;
    if (departamento) queryParams['departamento'] = departamento;
    this.router.navigate(['/propiedades'], { queryParams });
  }

  irAPagina(pagina: number) {
    this.paginaActual.set(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
