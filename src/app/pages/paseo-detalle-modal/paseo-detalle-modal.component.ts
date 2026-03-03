import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';

@Component({
  selector: 'app-paseo-detalle-modal',
  standalone: true,
  templateUrl: './paseo-detalle-modal.component.html',
  styleUrls: ['./paseo-detalle-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
// detalle de un paseo concreto
// aqui lo puedo editar o borrar si hace falta
export class PaseoDetalleModalComponent {

  @Input() idPaseo!: number;
  paseo: any = {};
  editando = false;

  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.api.getPaseoDetalle(this.idPaseo).subscribe({
      next: (res) => this.paseo = res,
      error: () => alert("Error al cargar el paseo")
    });
  }

  guardar() {
    if (!this.paseo.fecha || !this.paseo.duracionMinutos) {
      alert("Completa fecha y duraciÃ³n.");
      return;
    }
    if (this.paseo.duracionMinutos <= 0 || this.paseo.duracionMinutos > 1440) {
      alert("La duraciÃ³n debe estar entre 1 y 1440 minutos.");
      return;
    }
    if (this.paseo.distanciaKm !== null && this.paseo.distanciaKm !== undefined) {
      const d = Number(this.paseo.distanciaKm);
      if (d < 0 || d > 1000) {
        alert("La distancia debe estar entre 0 y 1000 km.");
        return;
      }
    }
    const hoy = new Date().toISOString().split('T')[0];
    if (this.paseo.fecha > hoy) {
      alert("La fecha del paseo no puede ser futura.");
      return;
    }
    const data = new FormData();
    data.append("idPaseo", this.paseo.idPaseo.toString());
    data.append("fecha", this.paseo.fecha);
    data.append("duracionMinutos", this.paseo.duracionMinutos.toString());
    data.append("distanciaKm", this.paseo.distanciaKm?.toString() || "");
    data.append("lugar", this.paseo.lugar || "");
    data.append("notas", this.paseo.notas || "");

    this.api.updatePaseo(data).subscribe({
      next: (r) => {
        if (r.status === "ok") {
          alert("Paseo actualizado");
          this.modalCtrl.dismiss(true);
        } else {
          alert("Error: " + (r.message || "No se pudo actualizar"));
        }
      },
      error: () => alert("Error al actualizar")
    });
  }

  async eliminar() {
    const alerta = await this.alertCtrl.create({
      header: "Eliminar paseo",
      message: "Â¿Seguro que quieres eliminar este paseo?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          handler: () => {
            this.api.deletePaseo(this.idPaseo).subscribe({
              next: (r) => {
                if (r?.status === "ok") this.modalCtrl.dismiss(true);
                else alert("Error al eliminar");
              },
              error: () => alert("Error al eliminar")
            });
          }
        }
      ]
    });
    await alerta.present();
  }

  cerrar() { this.modalCtrl.dismiss(); }
}

