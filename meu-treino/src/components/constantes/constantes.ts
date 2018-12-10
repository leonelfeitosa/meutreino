import { Component } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
<<<<<<< HEAD
  //url: string = 'http://localhost:3016/api/v1/';
  url: string = 'http://162.243.161.30:3016/api/v1/';
=======
  //url: string = 'http://192.168.0.100:3000/api/v1/';
  url: string = 'http://162.243.161.30:3016/api/v1/';
  verifica: number = 0;
>>>>>>> 1dddf6a4e8473d4e3cadac0ed82e7d837c5d74eb

  constructor() {
  }

  public getVerifica(){
    return this.verifica;
  }

  public setVerifica(verifica: number) {
    this.verifica = verifica;
  }
}
