import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';

@Component({
  selector: 'app-adopcion-add-modal',
  standalone: true,
  templateUrl: './adopcion-add-modal.component.html',
  styleUrls: ['./adopcion-add-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
// modal para publicar una adopcion nueva
// valido lo basico y mando los datos al backend
export class AdopcionAddModalComponent {

  @Input() idUsuario: number = 0;

  nombreMascota = "";
  especie = "";
  raza = "";
  edad = "";
  descripcion = "";
  contacto = "";
  foto: File | null = null;

  constructor(private modalCtrl: ModalController, private api: Api) {}

  cerrar() { this.modalCtrl.dismiss(); }

  seleccionarFoto(event: any) {
    this.foto = event.target.files[0];
  }

  guardar() {
    this.nombreMascota = this.nombreMascota.trim();
    this.especie = this.especie.trim();
    this.raza = this.raza.trim();
    this.edad = this.edad.trim();
    this.descripcion = this.descripcion.trim();
    this.contacto = this.contacto.trim();

    if (!this.nombreMascota || !this.especie || !this.contacto) {
      alert("Rellena al menos nombre, especie y contacto");
      return;
    }

    if (this.nombreMascota.length > 50 || this.especie.length > 50) {
      alert("Nombre y especie no pueden superar los 50 caracteres.");
      return;
    }

    if (this.raza.length > 50) {
      alert("La raza no puede superar los 50 caracteres.");
      return;
    }

    if (this.descripcion.length > 500) {
      alert("La descripciÃ³n es demasiado larga (mÃ¡ximo 500 caracteres).");
      return;
    }

    if (this.contacto.length < 5 || this.contacto.length > 200) {
      alert("Introduce un dato de contacto razonable (telÃ©fono o email).");
      return;
    }

    const formData = new FormData();
    formData.append("idUsuario", this.idUsuario.toString());
    formData.append("nombreMascota", this.nombreMascota);
    formData.append("especie", this.especie);
    formData.append("raza", this.raza);
    formData.append("edad", this.edad);
    formData.append("descripcion", this.descripcion);
    formData.append("contacto", this.contacto);

    if (this.foto) {
      formData.append("foto", this.foto);
    }

    this.api.addAdopcion(formData).subscribe(res => {
      if (res.status === "ok") {
        this.modalCtrl.dismiss(true);
      } else {
        alert("Error al publicar la adopciÃ³n");
      }
    });
  }
}

