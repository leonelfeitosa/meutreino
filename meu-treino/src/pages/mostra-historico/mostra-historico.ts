import { Component, Pipe, PipeTransform } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
//import * as io from 'socket.io-client';
/**
 * Generated class for the MostraHistoricoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mostra-historico',
  templateUrl: 'mostra-historico.html',
})
export class MostraHistoricoPage{
  headers: HttpHeaders;
  id: string;
  treino: string;
  nomeTreino: string;
  data: string;
  token: string;
  expires: string;
  socket:any;
  notificacao: string;
  idUsu: string;
  public dadoHistorico: any = {
    historico: ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private alertCtrl: AlertController) {
    this.headers = new HttpHeaders();
    this.token = localStorage.getItem("tokenAppPM");
    this.expires = localStorage.getItem("expiresAppPM");
    this.headers = this.headers.append('Authorization', this.token);
    if(new Date(this.expires) < new Date()) {
      this.navCtrl.push(LoginPage);
    }
     this.id = navParams.get('id');
     this.treino = navParams.get('treino');
     this.nomeTreino = navParams.get('nomeTreino');
     this.idUsu = localStorage.getItem('idUsuaAppPM');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MostraHistoricoPage');
  }

  sair(){
    this.navCtrl.push(LoginPage, {
      sair: '1'
    });
  }
}
