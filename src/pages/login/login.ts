import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: any;
  password: any;
  registerCredentials: { email: '', password: ''}
  loading: any;

  constructor(public auth: Auth, public user: User, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl:LoadingController) {}

  login(){
    this.showLoading();

      let loader = this.loadingCtrl.create({
        content: "Logging in..."
      });
      loader.present();

    this.auth.login('basic', {'email':this.email, 'password':this.password}).then(() => {
      console.log('ok i guess?');
      loader.dismissAll();
      this.navCtrl.setRoot(HomePage);        
    }, (err) => {
      loader.dismissAll();
      console.log(err.message);

      let errors = '';
      if(err.message === 'UNPROCESSABLE ENTITY') errors += 'Email isn\'t valid.<br/>';
      if(err.message === 'UNAUTHORIZED') errors += 'Password is required.<br/>';

      let alert = this.alertCtrl.create({
        title:'Login Error', 
        subTitle: err.message,
        buttons:['OK']
      });
      alert.present();
    });

    console.log(this.email + " " + this.password);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }  

  register(){
    this.navCtrl.push(RegisterPage);
  }  

}
