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
      img: 'departamentos/depa1.jpg'  // ❌ SIN la barra inicial
    },
    {
      tag: 'OPORTUNIDAD ÚNICA',
      titulo: 'CASA EN MIRAFLORES COUNTRY CLUB',
      subtitulo: 'ESTRENO',
      precio: 'US$ 400,000',
      img: 'departamentos/depa1.jpg'  // ❌ SIN la barra inicial
    },
    {
      tag: 'INVIERTE EN UN TERRENO',
      titulo: 'TERRENO EN EL CIRUELO',
      subtitulo: 'INVERSIÓN',
      precio: 'US$ 170 M²',
      img: 'departamentos/depa1.jpg'  // ❌ SIN la barra inicial
    }
  ];

  testimonios = [
    { 
      nombre: 'Carmen', 
      edad: 42, 
      comentario: 'Hicieron muy sencillo todo el proceso',
      foto: 'departamentos/depa1.jpg'  // ❌ SIN la barra inicial
    },
    { 
      nombre: 'Raúl', 
      edad: 38, 
      comentario: 'Encontré exactamente lo que buscaba', 
      foto: 'persona/persona1.jpg'  // ❌ SIN la barra inicial
    }
  ];

  ngOnInit() {}
}