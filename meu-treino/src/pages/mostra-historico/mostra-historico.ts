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
  historico: string;
  titulo: string;
  data: string;
  token: string;
  expires: string;
  socket:any;
  notificacao: string;
  idUsu: string;
  public dadoHistorico: any = {
    historico: ""
  }
  apiUrl = 'http://162.243.161.30:3015/api/v1/';
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private alertCtrl: AlertController) {
    this.headers = new HttpHeaders();
    this.token = localStorage.getItem("tokenAppPM");
    this.expires = localStorage.getItem("expiresAppPM");
    this.headers = this.headers.append('Authorization', this.token);
    if(new Date(this.expires) < new Date()) {
      this.navCtrl.push(LoginPage);
    }
     this.id = navParams.get('id');
     this.historico = navParams.get('historico');
     this.titulo = navParams.get('titulo');
     this.data = navParams.get('data');
     this.idUsu = localStorage.getItem('idUsuaAppPM');
     //this.socket = io('http://162.243.161.30:4555');
     //this.receive();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MostraHistoricoPage');
  }

  notificacaoAlert() {
    let alert = this.alertCtrl.create({
      title: 'Notificação',
      subTitle: this.notificacao,
      buttons: ['Fechar']
    });
    alert.present();
  }

  receive() {
        this.socket.on('notificacao', (notificacao, id) => {
          console.log("message "+id)
            if(JSON.stringify(id) === JSON.stringify(this.idUsu)){
              return new Promise(resolve => {
                this.http.get(this.apiUrl+'paciente-mobile/consultas/atualizada/'+this.id, {headers: this.headers}).subscribe(res => {
                  this.dadoHistorico = res;
                  this.historico = this.dadoHistorico.historico;
                  this.titulo = this.dadoHistorico.titulo;
                  this.data = this.dadoHistorico.data;
                }, error => {
                  console.log("error");
                });
              });
            }
        });
  }

  sair(){
    this.navCtrl.push(LoginPage, {
      sair: '1'
    });
  }
}
