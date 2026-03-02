import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from './app.service';
import { PropiedadDetalle } from './models/property.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  propiedades = signal<PropiedadDetalle[]>([]);
  paginaActual = signal(1);
  totalPaginas = signal(1);
  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  private todasHeroPropiedades = signal<PropiedadDetalle[]>([]);
  private filtros = signal({ tipoPropiedad: '', tipoListado: '', departamento: '' });

  tiposPropiedad = computed(() =>
    [...new Set(
      this.todasHeroPropiedades()
        .map(p => p.descripcionTipoPropiedad)
        .filter((v): v is string => !!v)
    )]
  );

  tiposListado = computed(() =>
    [...new Set(
      this.todasHeroPropiedades()
        .map(p => p.descripcionTipoListado)
        .filter((v): v is string => !!v)
    )]
  );

  departamentos = computed(() =>
    [...new Set(
      this.todasHeroPropiedades()
        .map(p => p.descripcionDepartamento)
        .filter((v): v is string => !!v)
    )]
  );

  propiedadesFiltradas = computed(() => {
    const { tipoPropiedad, tipoListado, departamento } = this.filtros();
    return this.todasHeroPropiedades().filter(p => {
      const matchTipo        = !tipoPropiedad || p.descripcionTipoPropiedad  === tipoPropiedad;
      const matchListado     = !tipoListado   || p.descripcionTipoListado    === tipoListado;
      const matchDepartamento = !departamento  || p.descripcionDepartamento  === departamento;
      return matchTipo && matchListado && matchDepartamento;
    });
  });

  heroPaginaActual = signal(1);
  heroTotalPaginas = computed(() =>
    Math.ceil(this.propiedadesFiltradas().length / 6)
  );
  heroPaginas = computed(() =>
    Array.from({ length: this.heroTotalPaginas() }, (_, i) => i + 1)
  );
  heroPropiedades = computed(() => {
    const inicio = (this.heroPaginaActual() - 1) * 6;
    return this.propiedadesFiltradas().slice(inicio, inicio + 6);
  });

  propiedadesPromo = computed(() =>
    this.todasHeroPropiedades().filter(p => p.descripcionPromocion !== null)
  );

  testimonios = [
    {
      nombre: 'Carmen',
      edad: 42,
      comentario: 'Hicieron muy sencillo todo el proceso',
      foto: 'departamentos/depa1.jpg'
    },
    {
      nombre: 'Raúl',
      edad: 38,
      comentario: 'Encontré exactamente lo que buscaba',
      foto: 'persona/persona1.jpg'
    }
  ];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.cargarPagina(1);
    this.cargarTodasHeroPropiedades();
  }

  cargarPagina(pagina: number) {
    this.appService.listarPropiedadDetalle(pagina).subscribe({
      next: (data) => {
        this.propiedades.set(data.items);
        this.paginaActual.set(data.numeroPagina);
        this.totalPaginas.set(data.totalPaginas);
      },
      error: (err) => console.error('Error al cargar propiedades', err)
    });
  }

  cargarPaginaHero(pagina: number) {
    this.heroPaginaActual.set(pagina);
  }

  buscar(tipoPropiedad: string, tipoListado: string, departamento: string) {
    this.heroPaginaActual.set(1);
    this.filtros.set({ tipoPropiedad, tipoListado, departamento });
  }

  private cargarTodasHeroPropiedades() {
    this.appService.listarPropiedadDetalle(1, 1000).subscribe({
      next: (data) => this.todasHeroPropiedades.set(data.items),
      error: (err) => console.error('Error al cargar propiedades hero', err)
    });
  }
}
