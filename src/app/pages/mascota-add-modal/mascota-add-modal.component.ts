import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';

@Component({
  selector: 'app-mascota-add-modal',
  standalone: true,
  templateUrl: './mascota-add-modal.component.html',
  styleUrls: ['./mascota-add-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
// modal para anadir mascota
// aqui controlo especie/raza y valido antes de guardar
export class MascotaAddModalComponent implements OnInit {

  @Input() idUsuario: number = 0;

  nombre = "";
  fechaNacimiento = "";
  fechaMax = "";
  foto: File | null = null;

  speciesOptions: string[] = ['Perro', 'Gato', 'Conejo', 'Ave', 'Reptil', 'Roedor', 'Otro'];
  razasPorEspecie: { [key: string]: string[] } = {
    'Perro': ['Mestizo', 'Labrador', 'Pastor alemÃ¡n', 'Bulldog', 'Yorkshire', 'Chihuahua'],
    'Gato': ['Mestizo', 'Europeo comÃºn', 'Siames', 'Persa', 'Maine Coon'],
    'Conejo': ['Enano', 'Belier', 'Rex'],
    'Ave': ['Periquito', 'Canario', 'Agapornis'],
    'Reptil': ['Iguana', 'Gecko leopardo', 'Tortuga'],
    'Roedor': ['HÃ¡mster', 'Cobaya', 'Rata', 'RatÃ³n']
  };

  especieSeleccionada = "";
  especieOtra = "";
  razasDisponibles: string[] = [];
  razaSeleccionada = "";
  razaOtra = "";
  guardando = false;

  constructor(
    private modalCtrl: ModalController,
    private api: Api
  ) {}

  ngOnInit() {
    this.fechaMax = new Date().toISOString().split('T')[0];

    if (!this.idUsuario || this.idUsuario <= 0) {
      const idLocal = Number(localStorage.getItem('idUsuario'));
      if (idLocal > 0) {
        this.idUsuario = idLocal;
      }
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  seleccionarFoto(event: any) {
    this.foto = event.target.files[0];
  }

  onEspecieChange() {
    this.razasDisponibles = this.razasPorEspecie[this.especieSeleccionada] || [];
    this.razaSeleccionada = "";
    this.razaOtra = "";
  }

  guardar() {
    if (this.guardando) return;

    this.nombre = (this.nombre || '').trim();
    this.especieOtra = (this.especieOtra || '').trim();
    this.razaOtra = (this.razaOtra || '').trim();

    const especieFinal = (this.especieSeleccionada === 'Otro'
      ? this.especieOtra
      : this.especieSeleccionada).trim();

    const usaSelectRazas = this.razasDisponibles.length > 0 && !!this.especieSeleccionada && this.especieSeleccionada !== 'Otro';
    const razaFinal = (usaSelectRazas && this.razaSeleccionada && this.razaSeleccionada !== 'Otra'
      ? this.razaSeleccionada
      : this.razaOtra).trim();

    if (!this.idUsuario || this.idUsuario <= 0) {
      alert("No se detecta la sesiÃ³n del usuario. Cierra sesiÃ³n e inicia sesiÃ³n otra vez.");
      return;
    }

    if (!this.nombre || !especieFinal || !razaFinal || !this.fechaNacimiento) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (this.fechaNacimiento > new Date().toISOString().split('T')[0]) {
      alert("La fecha de nacimiento no puede ser posterior a hoy.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", this.nombre);
    formData.append("especie", especieFinal);
    formData.append("raza", razaFinal);
    formData.append("fechaNacimiento", this.fechaNacimiento);
    formData.append("idDueno", this.idUsuario.toString());

    if (this.foto) {
      formData.append("foto", this.foto);
    }

    this.guardando = true;
    this.api.addMascota(formData).subscribe({
      next: (res: any) => {
        this.guardando = false;
        if (res.status === "ok") {
          this.modalCtrl.dismiss(true);
        } else {
          alert(res.mensaje || "No se pudo guardar la mascota.");
        }
      },
      error: (err) => {
        this.guardando = false;
        console.error("Error al guardar mascota:", err);
        const mensaje = err?.error?.mensaje || "Error de conexion al guardar. Revisa el servidor php y vuelve a intentarlo.";
        alert(mensaje);
      }
    });
  }
}

