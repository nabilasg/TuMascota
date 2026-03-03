import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

interface ProductoTienda {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  cantidadSeleccionada: number;
}

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

@Component({
  selector: 'app-tienda',
  standalone: true,
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterLink]
})
// pantalla de tienda
// aqui manejo productos, carrito y guardado en localStorage
export class TiendaPage implements OnInit, OnDestroy {
  private readonly CARRITO_KEY = 'tiendaCarrito';
  carritoAbierto = false;
  toastAbierto = false;
  toastMensaje = '';
  private toastTimerId: ReturnType<typeof setTimeout> | null = null;

  productos: ProductoTienda[] = [
    {
      id: 1,
      nombre: 'Correa resistente',
      descripcion: 'Perfecta para paseos diarios.',
      precio: 14.99,
      imagen: 'assets/icon/correa.png',
      cantidadSeleccionada: 1
    },
    {
      id: 2,
      nombre: 'Comida premium',
      descripcion: 'Bolsa de 3 kg para perro o gato.',
      precio: 24.5,
      imagen: 'assets/icon/comida.png',
      cantidadSeleccionada: 1
    },
    {
      id: 3,
      nombre: 'Juguete mordedor',
      descripcion: 'Goma segura para entretenimiento.',
      precio: 8.75,
      imagen: 'assets/icon/mordedor.jpg',
      cantidadSeleccionada: 1
    },
    {
      id: 4,
      nombre: 'Jaula cÃ³moda',
      descripcion: 'Espacio seguro y ventilado para tu mascota.',
      precio: 39.9,
      imagen: 'assets/icon/jaula.png',
      cantidadSeleccionada: 1
    },
    {
      id: 5,
      nombre: 'Pecera mediana',
      descripcion: 'Ideal para peces pequeÃ±os con buena visibilidad.',
      precio: 54.9,
      imagen: 'assets/icon/pecera.png',
      cantidadSeleccionada: 1
    },
    {
      id: 6,
      nombre: 'Pelota para gatos',
      descripcion: 'Ligera y divertida para estimular el juego.',
      precio: 6.9,
      imagen: 'assets/icon/pelotagatos.jpg',
      cantidadSeleccionada: 1
    }
  ];

  carrito: ItemCarrito[] = [];

  constructor(
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    if (this.toastTimerId) {
      clearTimeout(this.toastTimerId);
      this.toastTimerId = null;
    }
  }

  ngOnInit() {
    this.cargarCarritoGuardado();
  }

  get totalCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  get cantidadEnCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  anadirAlCarrito(producto: ProductoTienda) {
    const cantidad = Math.max(1, Math.floor(producto.cantidadSeleccionada || 1));
    const existente = this.carrito.find((item) => item.id === producto.id);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        imagen: producto.imagen
      });
    }

    this.guardarCarrito();
    this.mostrarToast('Producto aÃ±adido al carrito');
  }

  subirCantidad(item: ItemCarrito) {
    item.cantidad += 1;
    this.guardarCarrito();
  }

  bajarCantidad(item: ItemCarrito) {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      this.guardarCarrito();
      return;
    }
    this.eliminarDelCarrito(item.id);
  }

  eliminarDelCarrito(idProducto: number) {
    this.carrito = this.carrito.filter((item) => item.id !== idProducto);
    this.guardarCarrito();
  }

  abrirCarrito() {
    this.carritoAbierto = true;
    this.refrescarVista();
  }

  cerrarCarrito() {
    this.carritoAbierto = false;
    this.refrescarVista();
  }

  comprar() {
    if (this.carrito.length === 0) {
      this.mostrarToast('El carrito estÃ¡ vacÃ­o');
      return;
    }

    this.carrito = [];
    this.guardarCarrito();
    this.carritoAbierto = false;
    this.refrescarVista();
    this.mostrarToast('Compra hecha. Â¡Gracias!');
  }

  private guardarCarrito() {
    localStorage.setItem(this.CARRITO_KEY, JSON.stringify(this.carrito));
  }

  private cargarCarritoGuardado() {
    const raw = localStorage.getItem(this.CARRITO_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.carrito = parsed.filter((item) =>
          item &&
          typeof item.id === 'number' &&
          typeof item.nombre === 'string' &&
          typeof item.precio === 'number' &&
          typeof item.cantidad === 'number' &&
          typeof item.imagen === 'string'
        );
      }
    } catch {
      this.carrito = [];
    }
  }

  private mostrarToast(mensaje: string) {
    this.ngZone.run(() => {
    this.toastMensaje = mensaje;
      this.toastAbierto = true;
      this.refrescarVista();
    });

    if (this.toastTimerId) {
      clearTimeout(this.toastTimerId);
    }

    this.toastTimerId = setTimeout(() => {
      this.ngZone.run(() => {
        this.toastAbierto = false;
        this.refrescarVista();
      });
    }, 1800);
  }

  private refrescarVista() {
    this.cdr.detectChanges();
  }
}


