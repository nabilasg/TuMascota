/**
 * Prevents Angular change detection from
 * running with certain Web Component callbacks
 */
//en ionic, desactivar customElements puede romper deteccion de cambios
//en android webview (modales/toasts que se actualizan tarde)
//mantenemos el parche por defecto de zone.js
//eslint-disable-next-line no-underscore-dangle
(window as any).__Zone_disable_customElements = false;
