import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';
import { RouterLink, Router } from '@angular/router';
import { AdopcionAddModalComponent } from '../adopcion-add-modal/adopcion-add-modal.component';
import { AdopcionDetalleModalComponent } from '../adopcion-detalle-modal/adopcion-detalle-modal.component';

@Component({
  selector: 'app-adopciones',
  templateUrl: './adopciones.page.html',
  styleUrls: ['./adopciones.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
// aqui cargo las adopciones y puedo filtrar entre todas o solo las mias
// desde esta ventana tambien abro el modal para crear y ver detalle
export class AdopcionesPage {

  adopciones: any[] = [];
  idUsuario = 0;
  fotosUrl: string;
  filtro: 'todas' | 'mias' = 'todas';

  constructor(private api: Api, private modalCtrl: ModalController, private router: Router) {
    this.fotosUrl = this.api.FOTOS_URL;
  }

  ionViewWillEnter() {
    this.idUsuario = Number(localStorage.getItem("idUsuario"));
    this.cargarAdopciones();
  }

  cargarAdopciones() {
    if (this.filtro === 'mias') {
      this.api.getMisAdopciones(this.idUsuario).subscribe((res: any) => {
        this.adopciones = res || [];
      });
    } else {
      this.api.getAdopciones().subscribe((res: any) => {
        this.adopciones = res || [];
      });
    }
  }

  cambiarFiltro(filtro: 'todas' | 'mias') {
    this.filtro = filtro;
    this.cargarAdopciones();
  }

  async nuevaAdopcion() {
    const modal = await this.modalCtrl.create({
      component: AdopcionAddModalComponent,
      componentProps: { idUsuario: this.idUsuario },
      breakpoints: [0, 0.85],
      initialBreakpoint: 0.85
    });
    modal.onDidDismiss().then((res) => {
      if (res.data === true) this.cargarAdopciones();
    });
    await modal.present();
  }

  async verDetalle(adopcion: any) {
    const modal = await this.modalCtrl.create({
      component: AdopcionDetalleModalComponent,
      componentProps: { 
        idAdopcion: adopcion.idAdopcion,
        idUsuarioActual: this.idUsuario
      },
      breakpoints: [0, 0.95, 1],
      initialBreakpoint: 0.95
    });
    modal.onDidDismiss().then(res => {
      if (res.data === true) this.cargarAdopciones();
    });
    await modal.present();
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

