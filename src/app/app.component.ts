import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
/**
 * Componente raíz de la app.
 * Se encarga de montar el contenedor principal de Ionic y el enrutado.
 */
export class AppComponent {
  constructor() {}
}

