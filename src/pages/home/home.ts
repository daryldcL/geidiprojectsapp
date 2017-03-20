import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  projects: Array<string>;
  projectItem: string;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController,public storage: Storage, public auth: Auth) {
    this.projects = JSON.parse(localStorage.getItem("projectList"));
    if(this.projects === null){
      this.projects = ['Project Bato'];
    }
  }

  onPageDidEnter(){

  }

  delete(index: number){
    this.projects.splice(index,1);
    localStorage.setItem("projectList",JSON.stringify(this.projects));
  }

  add(){
    if(this.projectItem != ""){
      if(!this.projects.find(item => item === this.projectItem))
      {
        this.projects.push(this.projectItem);
        localStorage.setItem("projectList", JSON.stringify(this.projects));
      }else{
        let alert = this.alertCtrl.create({
          title:'Duplicate', 
          subTitle: 'Project name already exists',
          buttons:['OK']
        });
        alert.present();       
      }
    }
    this.projectItem = "";
  }

  signOut(){
    this.auth.logout();
    this.navCtrl.push(LoginPage);
  }
  
}
