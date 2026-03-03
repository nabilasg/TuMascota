import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { VacunaAddModalComponent } from '../vacuna-add-modal/vacuna-add-modal.component';
import { VacunaDetalleModalComponent } from '../vacuna-detalle-modal/vacuna-detalle-modal.component';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  templateUrl: './vacunas.page.html',
  styleUrls: ['./vacunas.page.scss'],
  imports: [CommonModule, IonicModule, RouterLink]
})
// listado de vacunas
// si hay mascota seleccionada saco solo esas, si no saco todas las del usuario
export class VacunasPage {

  vacunas: any[] = [];
  mascotaId = 0;
  vacunasCargadas = false;

  constructor(
    private api: Api, 
    private modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.mascotaId = Number(localStorage.getItem("idMascotaActual"));
    this.cargarVacunas();
  }

  cargarVacunas() {
    if (this.mascotaId && this.mascotaId > 0) {
      this.api.getVacunas(this.mascotaId).subscribe({
        next: (res) => {
          this.vacunas = res || [];
          this.vacunasCargadas = true;
        },
        error: () => {
          this.vacunas = [];
          this.vacunasCargadas = true;
        }
      });
    } else {
      const idUsuario = Number(localStorage.getItem("idUsuario"));
      if (idUsuario && idUsuario > 0) {
        this.api.getTodasVacunas(idUsuario).subscribe({
          next: (res) => {
            this.vacunas = res || [];
            this.vacunasCargadas = true;
          },
          error: () => {
            this.vacunas = [];
            this.vacunasCargadas = true;
          }
        });
      } else {
        this.vacunasCargadas = true;
      }
    }
  }

  async nuevaVacuna() {
    const modal = await this.modalCtrl.create({
      component: VacunaAddModalComponent,
      componentProps: { idMascota: this.mascotaId },
      breakpoints: [0, 0.6],
      initialBreakpoint: 0.6
    });

    modal.onDidDismiss().then(r => {
      if (r.data === true) this.cargarVacunas();
    });

    await modal.present();
  }

  async verDetalles(v: any) {
    const modal = await this.modalCtrl.create({
      component: VacunaDetalleModalComponent,
      componentProps: { idVacunacion: v.idVacunacion },
      breakpoints: [0, 0.75],
      initialBreakpoint: 0.75
    });

    modal.onDidDismiss().then(r => {
      if (r.data === true) this.cargarVacunas();
    });

    await modal.present();
  }

}

