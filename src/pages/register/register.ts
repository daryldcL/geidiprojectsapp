import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {
  registerForm: FormGroup;
  passMinLength = 4;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
                public loadingCtrl: LoadingController, public auth: Auth ) {}

  ionViewWillLoad(){
    this.registerForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(this.passMinLength),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    });

    this.registerForm.valueChanges.debounceTime(300).subscribe(data => this.onValueChanged(data));    
  }

  onValueChanged(data?:any){
    if(!this.registerForm){
      return;
    }

    const form = this.registerForm;
    for(const field in this.formErrors){
      this.formErrors[field] = [];
      this.registerForm[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid){
        const messages = this.validationMessages[field];
        for(const key in control.errors){
          this.formErrors[field].push(messages[key]);
        }
      }
    }
  }

  cancelRegister(){
    this.navCtrl.push(LoginPage);
  }

  tryRegister(formObject){
      var email = formObject['email'];
      var password = formObject['password'];

      if(email === '' || password === '') {
        let alert = this.alertCtrl.create({
          title:'Register Error', 
          subTitle:'All fields are required',
          buttons:['OK']
        });
        alert.present();
        return;
      }

      let details: UserDetails = {'email':email, 'password':password};
      console.log(details);
      
      let loader = this.loadingCtrl.create({
        content: "Registering your account..."
      });
      loader.present();

      this.auth.signup(details).then(() => {
        console.log('ok signup');
        this.auth.login('basic', {'email':details.email, 'password':details.password}).then(() => {
          loader.dismissAll();
          this.navCtrl.setRoot(HomePage);
        });

      }, (err:IDetailedError<string[]>) => {
        loader.dismissAll();
        let errors = '';
        for(let e of err.details) {
          console.log(e);
          if(e === 'required_email') errors += 'Email is required.<br/>';
          if(e === 'required_password') errors += 'Password is required.<br/>';
          if(e === 'conflict_email') errors += 'A user with this email already exists.<br/>';
          if(e === 'invalid_email') errors += 'Your email address isn\'t valid.';
        }
        let alert = this.alertCtrl.create({
          title:'Register Error', 
          subTitle:errors,
          buttons:['OK']
        });
        alert.present();
      });
  }

  formErrors = {
    'email': [],
    'password': []
  }

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'pattern': 'Enter a valid email.'
    },
    'password': {
      'required': 'Password is required',
      'pattern': 'Your password must contain at least one uppercase, one lowercase, and one number.',
      'minlength': 'Password must be at least ' + this.passMinLength + ' characters long.'
    }
  }

}
