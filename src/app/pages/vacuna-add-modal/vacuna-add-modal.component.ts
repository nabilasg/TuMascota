import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController, ActionSheetController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';

@Component({
  selector: 'app-vacuna-add-modal',
  standalone: true,
  templateUrl: './vacuna-add-modal.component.html',
  styleUrls: ['./vacuna-add-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
// modal para registrar una vacuna
// selecciono mascota y vacuna y guardo las fechas
export class VacunaAddModalComponent implements OnInit {

  @Input() idMascota!: number;

  vacunasDisponibles: any[] = [];
  mascotas: any[] = [];
  idVacuna = 0;
  idMascotaSeleccionada = 0;
  fechaAplicacion = "";
  fechaProxima = "";
  
  nombreMascotaSeleccionada = "";
  nombreVacunaSeleccionada = "";

  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.cargarMascotas();
    this.cargarVacunas();
    
    if (this.idMascota && this.idMascota > 0) {
      this.idMascotaSeleccionada = this.idMascota;
    } else {
      const idMascotaActual = Number(localStorage.getItem("idMascotaActual"));
      if (idMascotaActual && idMascotaActual > 0) {
        this.idMascotaSeleccionada = idMascotaActual;
      }
    }
  }

  cargarMascotas() {
    const idUsuario = Number(localStorage.getItem("idUsuario"));
    if (idUsuario && idUsuario > 0) {
      this.api.getMascotas(idUsuario).subscribe({
        next: (res) => {
          this.mascotas = res || [];
        },
        error: () => {
          this.mascotas = [];
        }
      });
    }
  }

  cargarVacunas() {
    this.api.getVacunasDisponibles().subscribe({
      next: (res) => {
        this.vacunasDisponibles = res || [];
      },
      error: () => {
        this.vacunasDisponibles = [];
      }
    });
  }

  guardar() {
    const mascotaId = this.idMascotaSeleccionada || this.idMascota;

    if (!this.idVacuna || this.idVacuna === 0 || !this.fechaAplicacion || !mascotaId || mascotaId === 0) {
      alert("Selecciona una mascota, una vacuna y una fecha de aplicaciÃ³n.");
      return;
    }

    if (this.fechaProxima && this.fechaProxima < this.fechaAplicacion) {
      alert("La fecha prÃ³xima no puede ser anterior a la fecha de aplicaciÃ³n.");
      return;
    }

    const data = new FormData();
    data.append("idMascota", mascotaId.toString());
    data.append("idVacuna", this.idVacuna.toString());
    data.append("fechaAplicacion", this.fechaAplicacion);
    data.append("fechaProxima", this.fechaProxima || "");

    this.api.addVacuna(data).subscribe({
      next: (res) => {
        if (res.status === "ok") {
          alert("Vacuna guardada correctamente");
          this.modalCtrl.dismiss(true);
        } else {
          alert("Error: " + (res.message || "No se pudo guardar la vacuna"));
        }
      },
      error: () => {
        alert("Error al guardar la vacuna");
      }
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async seleccionarMascota() {
    const buttons = this.mascotas.map(m => ({
      text: m.nombre,
      handler: () => {
        this.idMascotaSeleccionada = m.idMascota;
        this.nombreMascotaSeleccionada = m.nombre;
      }
    }));
    
    buttons.push({ text: 'Cancelar', handler: () => {} });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona una mascota',
      buttons: buttons
    });
    await actionSheet.present();
  }

  async seleccionarVacuna() {
    const buttons = this.vacunasDisponibles.map(v => ({
      text: v.nombre,
      handler: () => {
        this.idVacuna = v.idVacuna;
        this.nombreVacunaSeleccionada = v.nombre;
      }
    }));
    
    buttons.push({ text: 'Cancelar', handler: () => {} });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona una vacuna',
      buttons: buttons
    });
    await actionSheet.present();
  }
}

