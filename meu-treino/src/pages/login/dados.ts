import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'page-home',
  templateUrl: 'login.html'
})
export class DadosPage {
  token: string;
  expires: string;
  user: string;
  constructor(public modalCtrl: ModalController,
    ){}

  }

  