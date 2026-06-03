import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropiedadDetalle } from './models/property.component';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // POST — propiedades con promoción (para el inicio)
  obtenerPropiedadesConPromocion(): Observable<PropiedadDetalle[]> {
    return this.http.post<PropiedadDetalle[]>(
      `${this.apiUrl}/propiedaddetalle/obtenerpropiedadesconpromocionparaweb`,
      {}
    );
  }

  // POST — propiedades activas paginadas (para el apartado propiedades)
  obtenerPropiedadesActivasPaginadas(numeroPagina: number, tamanioPagina: number = 9): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/propiedaddetalle/obtenerpropiedadesactivasparaweb`,
      { numeroPagina, tamanioPagina }
    );
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
