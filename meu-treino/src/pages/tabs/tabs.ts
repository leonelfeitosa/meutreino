import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HistoricoPage } from '../historico/historico';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab2Root = HistoricoPage;

  constructor() {
  }
}
