import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { MostraHistoricoPage } from '../mostra-historico/mostra-historico';
//import * as io from 'socket.io-client';
import { BackgroundMode } from '@ionic-native/background-mode';
import {Camera, CameraOptions } from '@ionic-native/camera'
import { ConstantesComponent } from '../../components/constantes/constantes';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html'
})
export class HistoricoPage {
  Constantes: ConstantesComponent = new ConstantesComponent;
  apiUrl: string;
  token: string;
  expires: string;
  socket:any;
  idUsu: string;
  notificacao: string;
  existe: boolean = true;
  public dadosAluno: any = {
    _id: "",
    nome: "",
    cpf: "",
    IMC: "",
    msg: "",
    idade: "",
    peso: "",
    massaMagra: "",
    massaGorda: "",
    altura: "",
    dataInicio: ""
  }
  evolucaoExiste: boolean = false;

  public data: Date;

  public listaTreinos: any = {treino: {}, treinos: []};
 
  public evolucaoLista: any = [];

  headers: HttpHeaders;

  foto : any = 'assets/imgs/logobrandao.png';

  constructor(public navCtrl: NavController, public http: HttpClient, private alertCtrl: AlertController, private backgroundMode: BackgroundMode, private camera : Camera, private toastCtrl : ToastController) {
    this.apiUrl = this.Constantes.url;
    this.backgroundMode.enable();
    this.headers = new HttpHeaders();
    this.token = localStorage.getItem("tokenAppPM");
    this.expires = localStorage.getItem("expiresAppPM");
    this.headers = this.headers.append('Authorization', this.token);
    if(new Date(this.expires) < new Date()) {
      this.navCtrl.push(LoginPage);
    }
    this.idUsu = localStorage.getItem('idUsuaAppPM');
    this.buscaAluno();
    this.buscaEvolucao();
    this.buscaTreinos();
  }

  buscaAluno() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'alunos/'+this.idUsu, {headers: this.headers}).subscribe(res => {
        this.dadosAluno = res;
      }, error => {
        console.log("error");
      });
    });
  }

  buscaTreinos() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'treinos/'+this.idUsu, {headers: this.headers}).subscribe(res => {
        this.listaTreinos = res;
        if(this.listaTreinos.length > 0){
          this.data = res[0].data;
          this.existe = true;
        }else{
          this.existe = false;
        }
      }, error => {
        console.log("error");
      });
    });
  }

  buscaEvolucao() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'evolucaos/mobile/evolucao/'+this.idUsu, {headers: this.headers}).subscribe(res => {
        this.evolucaoLista = res;
        if(this.evolucaoLista.length > 0) {
          this.evolucaoExiste = true;
        }else{
          this.evolucaoExiste = false;
        }
      }, error => {
        console.log("error");
      });
    });
  }

  buscaTreino(id, treino, nomeTreino){
    this.navCtrl.push(MostraHistoricoPage, {
      id: id,
      treino: treino,
      nomeTreino: nomeTreino
    });
  }

  sair(){
    this.navCtrl.push(LoginPage, {
      sair: '1'
    });
  }

  notificacaoAlert() {
    let alert = this.alertCtrl.create({
      title: 'Notificação',
      subTitle: this.notificacao,
      buttons: ['Fechar']
    });
    alert.present();
  }

  tirarFoto(){
      const options: CameraOptions ={
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };

      this.camera.getPicture(options).then((imageData) =>{
        let base64Image = 'data:image/jpeg;base64,' +imageData;

        this.foto= base64Image;
      },(err) =>{
        this.toastCtrl.create({
          message : 'Não foi possível tirar a foto',
          duration: 2000,
          position: 'top'
        }).present();
      });
  }

  removeFoto(){
    this.foto = 'assets/imgs/logobrandao.png';
  }

  receive() {
        this.socket.on('notificacao', (notificacao, id) => {
            if(JSON.stringify(id) === JSON.stringify(this.idUsu)){
              this.notificacao = notificacao;
              this.notificacaoAlert();
              this.buscaTreinos();
            }
        });
  }
  
}
