import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent  } from './app/home/app.component';

const routes = [
  { path: '', component: AppComponent },
  { path: 'propiedades', component: AppComponent },
  { path: 'contacto', component: AppComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
