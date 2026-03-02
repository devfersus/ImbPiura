import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropiedadDetallePaginado } from './models/property.component';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarPropiedadDetalle(pagina: number = 1, cantidad: number = 6): Observable<PropiedadDetallePaginado> {
    return this.http.post<PropiedadDetallePaginado>(
      `${this.apiUrl}/propiedaddetalle/obtenerpropiedaddetalleParaweb`,
      { numeroPagina: pagina, cantidadRegistros: cantidad }
    );
  }
}
