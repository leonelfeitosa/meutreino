import { Component } from '@angular/core';

/**
 * Generated class for the ConstantesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'constantes',
  templateUrl: 'constantes.html'
})
export class ConstantesComponent {
  url: string = 'http://localhost:3000/api/v1/';
  //url: string = 'http://162.243.161.30:3015/api/v1/';

  constructor() {
  }

}
