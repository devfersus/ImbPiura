import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { PropiedadDetalle } from './models/property.component';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppService {
  private apiUrl = environment.apiUrl;
  private cachePromocion$: Observable<PropiedadDetalle[]> | null = null;
  private cachePaginadas = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  // GET — propiedades con promoción (para el inicio)
  obtenerPropiedadesConPromocion(): Observable<PropiedadDetalle[]> {
    if (!this.cachePromocion$) {
      this.cachePromocion$ = this.http.get<PropiedadDetalle[]>(
        `${this.apiUrl}/propiedaddetalle/obtenerpropiedadesconpromocionparaweb`
      ).pipe(shareReplay(1));
    }
    return this.cachePromocion$;
  }

  // GET — propiedades activas paginadas (para el apartado propiedades)
  obtenerPropiedadesActivasPaginadas(numeroPagina: number, tamanioPagina: number = 9): Observable<any> {
    const key = `${numeroPagina}-${tamanioPagina}`;
    if (!this.cachePaginadas.has(key)) {
      const request$ = this.http.get<any>(
        `${this.apiUrl}/propiedaddetalle/obtenerpropiedadesactivasparaweb`,
        { params: { numeroPagina, tamanioPagina } }
      ).pipe(shareReplay(1));
      this.cachePaginadas.set(key, request$);
    }
    return this.cachePaginadas.get(key)!;
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
