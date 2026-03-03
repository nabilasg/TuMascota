//este archivo se reemplaza en build con fileReplacements
//ng build cambia environment.ts por environment.prod.ts
//la lista de reemplazos esta en angular.json

export const environment = {
  production: false,
  //en ionic serve (navegador en tu pc), la api va por localhost
  apiUrl: 'http://localhost/TuMascotaAPI/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
//import 'zone.js/plugins/zone-error';  //incluido por angular cli
