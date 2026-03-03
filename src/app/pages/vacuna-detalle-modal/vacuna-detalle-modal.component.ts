import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  standalone: true,
  selector: 'app-vacuna-detalle-modal',
  templateUrl: './vacuna-detalle-modal.component.html',
  imports: [CommonModule, FormsModule, IonicModule]
})
// detalle de una vacuna aplicada
// aqui puedo editar la fecha o eliminar el registro
export class VacunaDetalleModalComponent implements OnInit {

  @Input() idVacunacion!: number;

  vacuna: any = {};
  editando = false;
  vacunasDisponibles: any[] = [];
  idVacunaSeleccionada = 0;

  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarVacunasDisponibles();
  }

  ionViewWillEnter() {
    this.api.getVacunaDetalle(this.idVacunacion).subscribe({
      next: (res) => {
        this.vacuna = res;
        if (res && res.idVacunacion) {
          this.vacuna.idVacunacion = res.idVacunacion;
        }
        this.idVacunaSeleccionada = Number(this.vacuna.idVacuna) || 0;
      },
      error: () => {
        alert("Error al cargar los detalles de la vacuna");
      }
    });
  }

  cargarVacunasDisponibles() {
    this.api.getVacunasDisponibles().subscribe(res => {
      this.vacunasDisponibles = (res || []).map((v: any) => ({
        ...v,
        idVacuna: Number(v.idVacuna)
      }));
    });
  }

  activarEdicion() {
    this.editando = true;
    if (!this.idVacunaSeleccionada && this.vacuna.idVacuna) {
      this.idVacunaSeleccionada = Number(this.vacuna.idVacuna);
    }
  }

  compararVacunas = (a: any, b: any) => Number(a) === Number(b);

  guardar() {
    if (!this.vacuna.fechaAplicacion || !this.idVacunaSeleccionada || this.idVacunaSeleccionada === 0 || !this.vacuna.idVacunacion) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (this.vacuna.fechaProxima && this.vacuna.fechaProxima < this.vacuna.fechaAplicacion) {
      alert("La fecha prÃ³xima no puede ser anterior a la fecha de aplicaciÃ³n.");
      return;
    }

    const data = new FormData();
    data.append("idVacunacion", this.vacuna.idVacunacion.toString());
    data.append("fechaAplicacion", this.vacuna.fechaAplicacion);
    data.append("fechaProxima", this.vacuna.fechaProxima || "");
    data.append("idVacuna", this.idVacunaSeleccionada.toString());

    this.api.updateVacuna(data).subscribe({
      next: (r) => {
        if (r.status === "ok") {
          alert("Vacuna actualizada correctamente");
          this.modalCtrl.dismiss(true);
        } else {
          alert("Error: " + (r.message || "No se pudo actualizar la vacuna"));
        }
      },
      error: () => {
        alert("Error al actualizar la vacuna");
      }
    });
  }

  async eliminar() {
    const confirmAlert = await this.alertCtrl.create({
      header: "Eliminar vacuna",
      message: "Â¿Seguro que quieres eliminar esta vacuna?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          handler: () => {
            this.api.deleteVacuna(this.idVacunacion).subscribe({
              next: (r) => {
                if (r?.status === "ok") {
                  this.modalCtrl.dismiss(true);
                } else {
                  window.alert("Error al eliminar la vacuna");
                }
              },
              error: () => window.alert("Error al eliminar la vacuna")
            });
          }
        }
      ]
    });
    await confirmAlert.present();
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}

