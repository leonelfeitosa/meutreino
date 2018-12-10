import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { MostraHistoricoPage } from '../mostra-historico/mostra-historico';
//import * as io from 'socket.io-client';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Camera, CameraOptions } from '@ionic-native/camera'
import { ConstantesComponent } from '../../components/constantes/constantes';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html'
})
export class HistoricoPage {
  Constantes: ConstantesComponent = new ConstantesComponent;
  apiUrl: string;
  evolucao: any;
  treino: any;
  aluno: any;
  descricao: string;
  token: string;
  expires: string;
  socket: any;
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

  public listaTreino: any = { treino: {}, treinos: [] };
  public listaTreinos: any = [];

  public evolucaoLista: any = [];
  public evolucaoListas: any = [];

  headers: HttpHeaders;

  foto: any = 'assets/imgs/logobrandao.png';

  constructor(private sqlite: SQLite, private network: Network, public navCtrl: NavController, public http: HttpClient, private alertCtrl: AlertController, private backgroundMode: BackgroundMode, private camera: Camera, private toastCtrl: ToastController) {
    this.apiUrl = this.Constantes.url;
    this.backgroundMode.enable();
    this.headers = new HttpHeaders();
    this.token = localStorage.getItem("tokenAppPM");
    this.expires = localStorage.getItem("expiresAppPM");
    this.headers = this.headers.append('Authorization', this.token);
    if (new Date(this.expires) < new Date()) {
      this.navCtrl.push(LoginPage);
    }

    this.idUsu = localStorage.getItem('idUsuaAppPM');
    if (this.Constantes.getVerifica() == 0) {
      this.getAluno(this.idUsu);
      this.getEvolucao();
      this.getTreinos();
      this.Constantes.setVerifica(1);
      this.http.get(this.apiUrl + 'evolucaos/mobile/evolucao/testa/' + this.idUsu, { headers: this.headers }).subscribe(res => {
        this.createDatabase()
          .then(() => {

          })
          .catch(() => {

          });
      }, error => {
        console.log("errorA");
      });
    }
  }

  public getDB() {
    return this.sqlite.create({
      name: 'aluno.db',
      location: 'default'
    });
  }

  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        this.removeAluno();
        this.removeEvolucao();
        this.removeTreino();
        this.createTables(db);
      })
      .catch(e => console.log(e));
  }

  private createTables(db: SQLiteObject) {
    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS alunos (id integer primary key AUTOINCREMENT NOT NULL, aluno_id TEXT, nome TEXT, cpf TEXT, idade integer, peso REAL, cintura REAL, massaMagra REAL, massaGorda REAL, IMC REAL, altura REAL, dataInicio TEXT, msg TEXT )'],
      ['CREATE TABLE IF NOT EXISTS evolucaos (id integer primary key AUTOINCREMENT NOT NULL, peso REAL, cintura REAL, massaMagra REAL, massaGorda REAL, IMC REAL, dataAvaliacao TEXT, aluno_id TEXT, FOREIGN KEY(aluno_id) REFERENCES alunos(aluno_id))'],
      ['CREATE TABLE IF NOT EXISTS treinos (id integer primary key AUTOINCREMENT NOT NULL, descricao TEXT, nome TEXT, treino TEXT, treino_id TEXT, aluno_id TEXT, FOREIGN KEY(aluno_id) REFERENCES alunos(aluno_id))']

    ])
      .then(() => {
        this.buscaAluno(db);
        this.buscaEvolucao(db);
        this.buscaTreinos(db);
        console.log('Tabelas criadas')
      })
      .catch(e => console.error('Erro ao criar as tabelas', e));
  }

  public removeAluno() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from alunos where id > ?';
        let data = [0];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public removeTreino() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from treinos where id > ?';
        let data = [0];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public removeEvolucao() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from evolucaos where id > ?';
        let data = [0];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  private insertAluno(db: SQLiteObject) {
    db.sqlBatch([
      ['insert into alunos (aluno_id, nome, cpf, idade, peso, cintura, massaMagra, massaGorda, IMC, altura, dataInicio, msg) values (?,?,?,?,?,?,?,?,?,?,?,?)', [this.aluno._id, this.aluno.nome, this.aluno.cpf, this.aluno.idade, this.aluno.peso, this.aluno.cintura, this.aluno.massaMagra, this.aluno.massaGorda, this.aluno.IMC, this.aluno.altura, this.aluno.dataInicio, this.aluno.msg]]
    ])
      .then(() => {
        this.getAluno(this.idUsu);
        console.log('Dados padrões incluídos')
      })
      .catch(e => console.error('Erro ao incluir dados padrões', e));
  }

  private insertEvolucao(db: SQLiteObject) {
    db.sqlBatch([
      ['insert into evolucaos (peso, cintura, massaMagra, massaGorda, IMC, dataAvaliacao, aluno_id) values (?,?,?,?,?,?,?)', [this.evolucao.peso, this.evolucao.cintura, this.evolucao.massaMagra, this.evolucao.massaGorda, this.evolucao.IMC, this.evolucao.dataAvaliacao, this.evolucao.aluno_id]]
    ])
      .then(() => {
        this.getEvolucao();
        console.log('Dados padrões incluídos')
      })
      .catch(e => console.error('Erro ao incluir dados padrões', e));
  }

  private insertTreino(db: SQLiteObject, descricao: string) {
    db.sqlBatch([
      ['insert into treinos (descricao, nome, treino, treino_id, aluno_id) values (?,?,?,?,?)', [descricao, this.treino.nome, this.treino.treino, this.treino.treino_id, this.treino.aluno_id]]
    ])
      .then(() => {
        this.getTreinos();
        console.log('Dados padrões incluídos')
      })
      .catch(e => console.error('Erro ao incluir dados padrões', e));
  }
  buscaAluno(db: SQLiteObject) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + 'alunos/' + this.idUsu, { headers: this.headers }).subscribe(res => {
        this.aluno = res;
        this.insertAluno(db);
      }, error => {
        console.log("error");
      });
    });
  }

  buscaTreinos(db: SQLiteObject) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + 'treinos/' + this.idUsu, { headers: this.headers }).subscribe(res => {
        this.listaTreino = res;
        if (this.listaTreino.treinos.length > 0) {
          this.listaTreino.treinos.forEach((valor) => {
            this.treino = valor;
            this.insertTreino(db, this.listaTreino.treino.descricao);
          });
          this.existe = true;
        } else {
          this.existe = false;
        }
      }, error => {
        console.log("error");
      });
    });
  }

  buscaEvolucao(db: SQLiteObject) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + 'evolucaos/mobile/evolucao/' + this.idUsu, { headers: this.headers }).subscribe(res => {
        this.evolucaoListas = res;
        if (this.evolucaoListas.length > 0) {
          this.evolucaoListas.forEach((valor) => {
            this.evolucao = valor;
            this.insertEvolucao(db);
          });
          this.evolucaoExiste = true;
        } else {
          this.evolucaoExiste = false;
        }
      }, error => {
        console.log("error");
      });
    });
  }

  public getAluno(id: string) {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from alunos where aluno_id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              this.dadosAluno._id = item.aluno_id;
              this.dadosAluno.nome = item.nome;
              this.dadosAluno.cpf = item.cpf;
              this.dadosAluno.idade = item.idade;
              this.dadosAluno.peso = item.peso;
              this.dadosAluno.cintura = item.cintura;
              this.dadosAluno.massaMagra = item.massaMagra;
              this.dadosAluno.massaGorda = item.massaGorda;
              this.dadosAluno.IMC = item.IMC;
              this.dadosAluno.altura = item.altura;
              this.dadosAluno.dataInicio = item.dataInicio;
              this.dadosAluno.msg = item.msg;
            } else {

            }
          })
          .catch((e) => {
            console.error(e)
          });
      })
      .catch((e) => {
        console.error(e)
      });
  }

  public getEvolucao() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM evolucaos';
        const data: any[] = [];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              this.evolucaoLista = [];
              for (var i = 0; i < data.rows.length; i++) {
                const valor = data.rows.item(i);
                this.evolucaoLista.push(valor);
                this.evolucao = this.evolucaoLista[0];
              }
              this.evolucaoExiste = true;
            } else {
              this.evolucaoExiste = false;
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getTreinos() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM treinos';
        const data: any[] = [];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              this.listaTreinos = [];
              for (var i = 0; i < data.rows.length; i++) {
                const valor = data.rows.item(i);
                this.listaTreinos.push(valor);
                this.descricao = valor.descricao;
              }
              this.evolucaoExiste = true;
            } else {
              this.evolucaoExiste = false;
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  buscaTreino(id, treino, nomeTreino) {
    this.navCtrl.push(MostraHistoricoPage, {
      id: id,
      treino: treino,
      nomeTreino: nomeTreino
    });
  }

  sair() {
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

  tirarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.foto = base64Image;
    }, (err) => {
      this.toastCtrl.create({
        message: 'Não foi possível tirar a foto',
        duration: 2000,
        position: 'top'
      }).present();
    });
  }

  removeFoto() {
    this.foto = 'assets/imgs/logobrandao.png';
  }

  receive() {
    this.socket.on('notificacao', (notificacao, id) => {
      if (JSON.stringify(id) === JSON.stringify(this.idUsu)) {
        this.notificacao = notificacao;
        this.notificacaoAlert();
        //this.buscaTreinos();
      }
    });
  }

}
