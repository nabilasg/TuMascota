import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController, ActionSheetController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';

@Component({
  selector: 'app-paseo-add-modal',
  standalone: true,
  templateUrl: './paseo-add-modal.component.html',
  styleUrls: ['./paseo-add-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
// modal para guardar un paseo nuevo
// elijo mascota, valido los campos y lo registro
export class PaseoAddModalComponent implements OnInit {

  mascotas: any[] = [];
  idMascota = 0;
  nombreMascota = "";
  fecha = "";
  duracion: number | null = null;
  distancia: number | null = null;
  lugar = "";
  notas = "";

  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    const idUsuario = Number(localStorage.getItem("idUsuario"));
    if (idUsuario > 0) {
      this.api.getMascotas(idUsuario).subscribe((res) => this.mascotas = res || []);
    }
    this.fecha = new Date().toISOString().split('T')[0];
  }

  async seleccionarMascota() {
    const buttons = this.mascotas.map(m => ({
      text: m.nombre,
      handler: () => { this.idMascota = m.idMascota; this.nombreMascota = m.nombre; }
    }));
    buttons.push({ text: 'Cancelar', handler: () => {} });

    const sheet = await this.actionSheetCtrl.create({ header: 'Selecciona mascota', buttons });
    await sheet.present();
  }

  guardar() {
    if (!this.idMascota || !this.fecha || !this.duracion) {
      alert("Selecciona mascota, fecha y duraciÃ³n.");
      return;
    }
    if (this.duracion <= 0 || this.duracion > 1440) {
      alert("La duraciÃ³n debe estar entre 1 y 1440 minutos.");
      return;
    }
    if (this.distancia !== null && this.distancia !== undefined) {
      if (this.distancia < 0 || this.distancia > 1000) {
        alert("La distancia debe estar entre 0 y 1000 km.");
        return;
      }
    }
    const hoy = new Date().toISOString().split('T')[0];
    if (this.fecha > hoy) {
      alert("La fecha del paseo no puede ser futura.");
      return;
    }
    const data = new FormData();
    data.append("idMascota", this.idMascota.toString());
    data.append("fecha", this.fecha);
    data.append("duracionMinutos", this.duracion.toString());
    data.append("distanciaKm", this.distancia?.toString() || "");
    data.append("lugar", this.lugar);
    data.append("notas", this.notas);

    this.api.addPaseo(data).subscribe({
      next: (res) => {
        if (res.status === "ok") {
          alert("Paseo registrado");
          this.modalCtrl.dismiss(true);
        } else {
          alert("Error: " + (res.message || "No se pudo guardar"));
        }
      },
      error: () => alert("Error al guardar el paseo")
    });
  }

  cerrar() { this.modalCtrl.dismiss(); }
}

