import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';

@Component({
  selector: 'app-mascota-detalle-modal',
  standalone: true,
  templateUrl: './mascota-detalle-modal.component.html',
  styleUrls: ['./mascota-detalle-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
// modal para ver la mascota en detalle
// desde aqui puedo editar datos, cambiar foto o eliminarla
export class MascotaDetalleModalComponent {

  @Input() idMascota!: number;

  mascota: any = {};
  editando = false;
  nuevaFoto: File | null = null;
  fotosUrl: string;
  fotoAmpliadaSrc = '';

  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.fotosUrl = this.api.FOTOS_URL;
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.api.getMascota(this.idMascota).subscribe(res => {
      this.mascota = res;
    });
  }

  activarEdicion() {
    this.editando = true;
  }

  seleccionarFoto(event: any) {
    this.nuevaFoto = event.target.files[0];
  }

  getFotoSrc(): string {
    return this.mascota?.fotoData || (this.mascota?.foto ? this.fotosUrl + this.mascota.foto : 'assets/icon/iconoperro.png');
  }

  ampliarFoto() {
    this.fotoAmpliadaSrc = this.getFotoSrc();
  }

  cerrarFotoAmpliada() {
    this.fotoAmpliadaSrc = '';
  }

  guardarCambios() {
    this.mascota.nombre = (this.mascota.nombre || '').trim();
    this.mascota.especie = (this.mascota.especie || '').trim();
    this.mascota.raza = (this.mascota.raza || '').trim();

    if (!this.mascota.nombre || !this.mascota.especie || !this.mascota.raza) {
      alert("Nombre, especie y raza son obligatorios.");
      return;
    }

    if (this.mascota.nombre.length > 50 || this.mascota.especie.length > 50 || this.mascota.raza.length > 50) {
      alert("Nombre, especie y raza no pueden superar los 50 caracteres.");
      return;
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (this.mascota.fechaNacimiento && this.mascota.fechaNacimiento > hoy) {
      alert("La fecha de nacimiento no puede ser posterior a hoy.");
      return;
    }

    const formData = new FormData();
    formData.append("idMascota", this.mascota.idMascota);
    formData.append("nombre", this.mascota.nombre);
    formData.append("especie", this.mascota.especie);
    formData.append("raza", this.mascota.raza);
    formData.append("fechaNacimiento", this.mascota.fechaNacimiento);

    if (this.nuevaFoto) {
      formData.append("foto", this.nuevaFoto);
    }

    this.api.updateMascota(formData).subscribe(res => {
      if (res.status === "ok") {
        this.editando = false;
        this.modalCtrl.dismiss(true);
      } else {
        alert("Error al actualizar mascota");
      }
    });
  }

  async eliminarMascota() {
    const alert = await this.alertCtrl.create({
      header: "Eliminar mascota",
      message: "Â¿Seguro que quieres eliminar esta mascota?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          handler: () => {
            this.api.deleteMascota(this.idMascota).subscribe(res => {
              if (res.status === "ok") {
                this.modalCtrl.dismiss(true);
              }
            });
          }
        }
      ]
    });

    alert.present();
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}

