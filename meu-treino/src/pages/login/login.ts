import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController, Backdrop } from 'ionic-angular';
import { MenuController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http'
import { DadosPage } from './dados';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { HistoricoPage } from '../historico/historico';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-home',
  templateUrl: 'login.html'
})
export class LoginPage {

  cpf_cnpj = '';
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  pureResult: any;
  maskedId: any;
  val: any;
  v: any;
  cpf: string;
  senha: string;
  retornoLogin: DadosPage = new DadosPage(this.modalCtrl);
  apiUrl = 'http://162.243.161.30:3015/api/v1/';
  mensagem: string;
  expires: string;
  sair: string;

  constructor(public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private menu: MenuController,
    public navCtrl: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    private toastCtrl : ToastController
    ){
      this.sair = navParams.get('sair');
      if(this.sair){
        this.logout();
      }
      this.expires = localStorage.getItem("expiresAppPM");
      if(new Date(this.expires) > new Date() && this.expires != '') {
        this.navCtrl.push(HistoricoPage);
      }
    }

    ionViewDidEnter() {
      this.menu.swipeEnable(false);
    }
    ionViewWillLeave(){
      this.menu.swipeEnable(true);
    }

    logar() {
      this.http.post(this.apiUrl+'login', {cpf: this.cpf, senha: this.senha, usuario: 'Paciente'})
      .subscribe((data: DadosPage) => {
        this.retornoLogin = data;
        localStorage.setItem('tokenAppPM', this.retornoLogin.token);
        localStorage.setItem('expiresAppPM', this.retornoLogin.expires);
        localStorage.setItem('idUsuaAppPM', this.retornoLogin.user);
        this.navCtrl.push(HistoricoPage);
      },(err) =>{
        this.toastCtrl.create({
          message : 'CPF ou Senha Incorretos',
          duration: 2000,
          position: 'top',
          
        }).present();

       
        
        console.log("CPF ou Senha Incorretos");
        
      });
    } 
    logout(){
      localStorage.setItem('tokenAppPM', '');
      localStorage.setItem('expiresAppPM', '');
      localStorage.setItem('idUsuaAppPM', '');
    }
    format(valString) {
      if (!valString) {
          return '';
      }
      let val = valString.toString();
      const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
      this.pureResult = parts;
      if(parts[0].length <= 11){
        this.maskedId = this.cpf_mask(parts[0]);
        return this.maskedId;
      }else{
        this.maskedId = this.cnpj(parts[0]);
        return this.maskedId;
      }
  };

  unFormat(val) {
      if (!val) {
          return '';
      }
      val = val.replace(/\D/g, '');

      if (this.GROUP_SEPARATOR === ',') {
          return val.replace(/,/g, '');
      } else {
          return val.replace(/\./g, '');
      }
  };

   cpf_mask(v) {
      v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
      v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
      v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
      //de novo (para o segundo bloco de números)
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
      return v;
  }

   cnpj(v) {
      v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
      v = v.replace(/^(\d{2})(\d)/, '$1.$2'); //Coloca ponto entre o segundo e o terceiro dígitos
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); //Coloca ponto entre o quinto e o sexto dígitos
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2'); //Coloca uma barra entre o oitavo e o nono dígitos
      v = v.replace(/(\d{4})(\d)/, '$1-$2'); //Coloca um hífen depois do bloco de quatro dígitos
      return v;
  }

  }
