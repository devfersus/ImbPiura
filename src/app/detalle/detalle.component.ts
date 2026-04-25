import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppService } from '../home/app.service';
import { PropiedadDetalle, PropiedadAgrupada } from '../home/models/property.component';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private appService = inject(AppService);

  propiedad = signal<PropiedadAgrupada | null>(null);
  cargando = signal(true);
  fotoActual = signal(0);
  lightboxFoto = signal<string | null>(null);

  fotos = computed(() => this.propiedad()?.fotos ?? []);
  totalFotos = computed(() => this.fotos().length);
  fotoActualUrl = computed(() => this.fotos()[this.fotoActual()] ?? '');

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.appService.listarPropiedadDetalle(1, 1000).subscribe({
      next: (data) => {
        const items = this.appService.extractItems(data);
        const item = items.find(p => this.appService.slugify(p.titulo) === slug) ?? null;
        this.propiedad.set(item ? this.mapearPropiedad(item) : null);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar detalle', err);
        this.cargando.set(false);
      }
    });
  }

  anteriorFoto() {
    this.fotoActual.update(i => (i > 0 ? i - 1 : this.totalFotos() - 1));
  }

  siguienteFoto() {
    this.fotoActual.update(i => (i < this.totalFotos() - 1 ? i + 1 : 0));
  }

  seleccionarFoto(index: number) {
    this.fotoActual.set(index);
  }

  abrirLightbox(foto: string) {
    this.lightboxFoto.set(foto);
  }

  cerrarLightbox() {
    this.lightboxFoto.set(null);
  }

  get whatsappUrl(): string {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://www.lotengoinmobiliaria.com';
    const mensaje = `Hola, quiero asesoría personalizada sobre esta propiedad: ${url}`;
    return `https://wa.me/51943449197?text=${encodeURIComponent(mensaje)}`;
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
