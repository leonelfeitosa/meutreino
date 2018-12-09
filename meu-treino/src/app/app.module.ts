import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Pipe, PipeTransform } from '@angular/core';
import { IonMaskModule } from '@pluritech/ion-mask';
import { HttpClientModule } from '@angular/common/http'
import { HistoricoPage } from '../pages/historico/historico';
import { LoginPage } from '../pages/login/login';
import { MostraHistoricoPage } from '../pages/mostra-historico/mostra-historico';
import { DadosPage } from '../pages/login/dados';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite'
import { Network } from '@ionic-native/network';

@NgModule({
  declarations:
  [
    TabsPage,
    MyApp,
    LoginPage,
    HistoricoPage,
    MostraHistoricoPage,
    DadosPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Voltar'
     }),
    IonMaskModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TabsPage,
    MyApp,
    HistoricoPage,
    LoginPage,
    MostraHistoricoPage,
    DadosPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundMode,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    Network
  ]
})
export class AppModule {}
