import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';

@Component({
  selector: 'app-adopcion-detalle-modal',
  standalone: true,
  templateUrl: './adopcion-detalle-modal.component.html',
  styleUrls: ['./adopcion-detalle-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
// este modal es para ver una adopcion en detalle
// si es mia la puedo editar, marcar como adoptada o borrar
export class AdopcionDetalleModalComponent {

  @Input() idAdopcion!: number;
  @Input() idUsuarioActual: number = 0;

  adopcion: any = {};
  editando = false;
  nuevaFoto: File | null = null;
  fotosUrl: string;
  esMia = false;
  fotoAmpliadaSrc = '';

  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.fotosUrl = this.api.FOTOS_URL;
  }

  ionViewWillEnter() {
    this.api.getAdopcionDetalle(this.idAdopcion).subscribe((res: any) => {
      this.adopcion = res;
      this.esMia = (Number(this.adopcion.idUsuario) === this.idUsuarioActual);
    });
  }

  activarEdicion() { this.editando = true; }

  seleccionarFoto(event: any) {
    this.nuevaFoto = event.target.files[0];
  }

  getFotoSrc(): string {
    return this.adopcion?.fotoData || (this.adopcion?.foto ? this.fotosUrl + this.adopcion.foto : 'assets/icon/adopcion.png');
  }

  ampliarFoto() {
    this.fotoAmpliadaSrc = this.getFotoSrc();
  }

  cerrarFotoAmpliada() {
    this.fotoAmpliadaSrc = '';
  }

  guardarCambios() {
    this.adopcion.nombreMascota = (this.adopcion.nombreMascota || '').trim();
    this.adopcion.especie = (this.adopcion.especie || '').trim();
    this.adopcion.raza = (this.adopcion.raza || '').trim();
    this.adopcion.edad = (this.adopcion.edad || '').trim();
    this.adopcion.descripcion = (this.adopcion.descripcion || '').trim();
    this.adopcion.contacto = (this.adopcion.contacto || '').trim();

    if (!this.adopcion.nombreMascota || !this.adopcion.especie || !this.adopcion.contacto) {
      alert("Nombre, especie y contacto son obligatorios.");
      return;
    }

    if (this.adopcion.nombreMascota.length > 50 || this.adopcion.especie.length > 50) {
      alert("Nombre y especie no pueden superar los 50 caracteres.");
      return;
    }

    if (this.adopcion.raza.length > 50) {
      alert("La raza no puede superar los 50 caracteres.");
      return;
    }

    if (this.adopcion.descripcion.length > 500) {
      alert("La descripciÃ³n es demasiado larga (mÃ¡ximo 500 caracteres).");
      return;
    }

    if (this.adopcion.contacto.length < 5 || this.adopcion.contacto.length > 200) {
      alert("Introduce un dato de contacto razonable (telÃ©fono o email).");
      return;
    }

    const formData = new FormData();
    formData.append("idAdopcion", this.adopcion.idAdopcion);
    formData.append("nombreMascota", this.adopcion.nombreMascota);
    formData.append("especie", this.adopcion.especie);
    formData.append("raza", this.adopcion.raza || '');
    formData.append("edad", this.adopcion.edad || '');
    formData.append("descripcion", this.adopcion.descripcion || '');
    formData.append("contacto", this.adopcion.contacto);
    formData.append("estado", this.adopcion.estado);

    if (this.nuevaFoto) {
      formData.append("foto", this.nuevaFoto);
    }

    this.api.updateAdopcion(formData).subscribe((res: any) => {
      if (res.status === "ok") {
        this.editando = false;
        this.modalCtrl.dismiss(true);
      } else {
        alert("Error al actualizar");
      }
    });
  }

  async marcarAdoptada() {
    const alerta = await this.alertCtrl.create({
      header: "Marcar como adoptada",
      message: "Â¿Esta mascota ya ha sido adoptada?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "SÃ­, adoptada",
          handler: () => {
            const formData = new FormData();
            formData.append("idAdopcion", this.adopcion.idAdopcion);
            formData.append("nombreMascota", this.adopcion.nombreMascota);
            formData.append("especie", this.adopcion.especie);
            formData.append("raza", this.adopcion.raza || '');
            formData.append("edad", this.adopcion.edad || '');
            formData.append("descripcion", this.adopcion.descripcion || '');
            formData.append("contacto", this.adopcion.contacto);
            formData.append("estado", "adoptada");

            this.api.updateAdopcion(formData).subscribe((res: any) => {
              if (res.status === "ok") this.modalCtrl.dismiss(true);
              else alert("Error al marcar como adoptada");
            });
          }
        }
      ]
    });
    await alerta.present();
  }

  async eliminarAdopcion() {
    const alerta = await this.alertCtrl.create({
      header: "Eliminar publicaciÃ³n",
      message: "Â¿Seguro que quieres eliminar esta publicaciÃ³n?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          handler: () => {
            this.api.deleteAdopcion(this.idAdopcion).subscribe((res: any) => {
              if (res.status === "ok") this.modalCtrl.dismiss(true);
              else alert("Error al eliminar");
            });
          }
        }
      ]
    });
    await alerta.present();
  }

  cerrar() { this.modalCtrl.dismiss(); }
}

