import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  propiedades = [
    {
      tag: 'PROPIEDADES DESTACADAS',
      titulo: 'CASA EN LOS EJIDOS',
      subtitulo: 'ESTRENO',
      precio: 'US$ 400,000',
      img: 'casa1.jpg'
    },
    {
      tag: 'OPORTUNIDAD ÚNICA',
      titulo: 'CASA EN MIRAFLORES COUNTRY CLUB',
      subtitulo: 'ESTRENO',
      precio: 'US$ 400,000',
      img: 'assets/casa1.jpg'
    },
    {
      tag: 'INVIERTE EN UN TERRENO',
      titulo: 'TERRENO EN EL CIRUELO',
      subtitulo: 'INVERSIÓN',
      precio: 'US$ 170 M²',
      img: 'assets/casa3.jpg'
    }
  ];

  testimonios = [
    { nombre: 'Carmen', edad: 42, comentario: 'Hicieron muy sencillo todo el proceso', foto: 'casa1.jpg' },
    { nombre: 'Raúl', edad: 38, comentario: 'Encontré exactamente lo que buscaba', foto: 'casa1.jpg' }
  ];

  ngOnInit() {}
}