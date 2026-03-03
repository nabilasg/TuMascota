import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio central de acceso al backend PHP.
 * Agrupa en un solo punto todas las llamadas HTTP para mascotas, vacunas, paseos,
 * adopciones y perfil, de forma que las páginas solo se centren en la UI.
 */
export class Api {

  //cambio esta ip segun donde pruebo
  //emulador android: 10.0.2.2
  //movil real: ip local de mi pc (ej 192.168.1.240)
  //ionic serve en mi pc: localhost
  private API_URL = this.normalizarBaseUrl('http://192.168.1.240/TuMascotaAPI/');

  public FOTOS_URL = this.API_URL + 'fotos/';

  private httpOptions = {};

  constructor(private http: HttpClient) {}

  private get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.API_URL + endpoint, this.httpOptions);
  }

  private post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(this.API_URL + endpoint, data, this.httpOptions);
  }

  private normalizarBaseUrl(url: string): string {
    return url.endsWith('/') ? url : `${url}/`;
  }

  register(data: any): Observable<any> {
    return this.post("register.php", data);
  }

  login(data: any): Observable<any> {
    return this.post("login.php", data);
  }

  getMascotas(idUsuario: number): Observable<any> {
    return this.get("mascotas_list.php?idUsuario=" + idUsuario);
  }

  addMascota(data: any): Observable<any> {
    return this.post("mascota_add.php", data);
  }

  getMascota(idMascota: number): Observable<any> {
    return this.get("mascota_detalle.php?idMascota=" + idMascota);
  }

  updateMascota(data: FormData): Observable<any> {
    return this.post("mascota_update.php", data);
  }

  deleteMascota(idMascota: number): Observable<any> {
    return this.get("mascota_delete.php?idMascota=" + idMascota);
  }

  getVacunas(idMascota: number): Observable<any> {
    return this.get("vacunas_list.php?idMascota=" + idMascota);
  }

  getTodasVacunas(idUsuario: number): Observable<any> {
    return this.get("vacunas_list.php?idUsuario=" + idUsuario);
  }

  addVacuna(data: any): Observable<any> {
    return this.post("vacuna_add.php", data);
  }

  getVacunaDetalle(idVacunacion: number): Observable<any> {
    return this.get("vacuna_detalle.php?idVacunacion=" + idVacunacion);
  }

  updateVacuna(data: FormData): Observable<any> {
    return this.post("vacuna_update.php", data);
  }

  deleteVacuna(idVacunacion: number): Observable<any> {
    return this.get("vacuna_delete.php?idVacunacion=" + idVacunacion);
  }

  getVacunasDisponibles(): Observable<any> {
    return this.get("vacunas_disponibles.php");
  }

  getPaseos(idUsuario: number): Observable<any> {
    return this.get("paseos_list.php?idUsuario=" + idUsuario);
  }

  addPaseo(data: any): Observable<any> {
    return this.post("paseo_add.php", data);
  }

  getPaseoDetalle(idPaseo: number): Observable<any> {
    return this.get("paseo_detalle.php?idPaseo=" + idPaseo);
  }

  updatePaseo(data: FormData): Observable<any> {
    return this.post("paseo_update.php", data);
  }

  deletePaseo(idPaseo: number): Observable<any> {
    return this.get("paseo_delete.php?idPaseo=" + idPaseo);
  }

  getAdopciones(): Observable<any> {
    return this.get("adopciones_list.php");
  }

  getMisAdopciones(idUsuario: number): Observable<any> {
    return this.get("adopciones_list.php?idUsuario=" + idUsuario);
  }

  addAdopcion(data: FormData): Observable<any> {
    return this.post("adopcion_add.php", data);
  }

  getAdopcionDetalle(idAdopcion: number): Observable<any> {
    return this.get("adopcion_detalle.php?idAdopcion=" + idAdopcion);
  }

  updateAdopcion(data: FormData): Observable<any> {
    return this.post("adopcion_update.php", data);
  }

  deleteAdopcion(idAdopcion: number): Observable<any> {
    return this.get("adopcion_delete.php?idAdopcion=" + idAdopcion);
  }

  getUsuarioPerfil(idUsuario: number): Observable<any> {
    return this.get("usuario_perfil.php?idUsuario=" + idUsuario);
  }

  eliminarUsuario(idUsuario: number): Observable<any> {
    return this.get("usuario_delete.php?idUsuario=" + idUsuario);
  }

  actualizarUsuario(idUsuario: number, datos: any): Observable<any> {
    return this.post("usuario_update.php", {
      idUsuario: idUsuario,
      ...datos
    });
  }

}

