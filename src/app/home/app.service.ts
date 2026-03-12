import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { PropiedadDetalle } from './models/property.component';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppService {
  private apiUrl = environment.apiUrl;
  private cache$: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  listarPropiedadDetalle(pagina: number = 1, cantidad: number = 100): Observable<any> {
    if (!this.cache$) {
      this.cache$ = this.http.post<any>(
        `${this.apiUrl}/propiedaddetalle/obtenerpropiedaddetalleParaweb`,
        { numeroPagina: pagina, cantidadRegistros: cantidad }
      ).pipe(shareReplay(1));
    }
    return this.cache$;
  }

  extractItems(data: any): PropiedadDetalle[] {
    return data.items ?? [];
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
