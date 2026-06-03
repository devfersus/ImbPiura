import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AppService } from './app.service';
import { PropiedadDetalle, PropiedadAgrupada } from './models/property.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  private todasPropiedades = signal<PropiedadDetalle[]>([]);

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

  propiedadesPromo = computed(() =>
    this.todasPropiedades()
      .filter(p => p.activo && !!p.descripcionPromocion)
      .map(p => this.mapearPropiedad(p))
  );

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit() {
    this.appService.obtenerPropiedadesConPromocion().subscribe({
      next: (data) => this.todasPropiedades.set(data),
      error: (err) => console.error('Error al cargar propiedades', err)
    });
  }

  trackBySlug(_: number, p: PropiedadAgrupada) { return p.slug; }

  buscar(tipoPropiedad: string, tipoListado: string, departamento: string) {
    const queryParams: Record<string, string> = {};
    if (tipoPropiedad) queryParams['tipo'] = tipoPropiedad;
    if (tipoListado) queryParams['listado'] = tipoListado;
    if (departamento) queryParams['departamento'] = departamento;
    this.router.navigate(['/propiedades'], { queryParams });
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
