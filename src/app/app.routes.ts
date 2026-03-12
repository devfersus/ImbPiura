import { Routes } from '@angular/router';
import { HomeComponent } from './home/app.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { DetalleComponent } from './detalle/detalle.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'propiedades', component: PropiedadesComponent },
  { path: 'propiedad/:slug', component: DetalleComponent },
];
