import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import { Location } from '@angular/common';

import { User } from '../user';
import { Verification } from '../verification';
import { UserService } from '../services/userService';
import { VerificationService } from '../services/VerificationService';

import * as moment from 'moment';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  preferenceForm: FormGroup;
  auth: string;
  user= new User();
  preference = new Verification();
  errorHourOne: string;
  errorHourTwo: string;
  errorHourThree: string;
  errorDate: string;
  today: string;

  constructor(private location: Location, private fb: FormBuilder,private userService: UserService,private verificationService: VerificationService ) { }

  ngOnInit() {
    this.today = moment().format('YYYY-DD-MM')
    this.auth = localStorage.getItem('Auth');
    this.getUser();
    this.getVerification();

    console.log(this.preference);

    this.preferenceForm = this.fb.group({
      verification: ['', Validators.required],
      one_hour: ['', Validators.required],
      two_hour:[''],
      three_hour: [''],
      four_hour: [''],
      notification: ['',Validators.required],
      verification_date: ['', Validators.required]
    })
  }

  getUser(): void{
    this.userService.getUser(this.auth).subscribe({
      next: value => {
        console.log(value),
        this.user = value;
        if(this.user.id == undefined) {
          localStorage.removeItem('Auth');
        }
      },
      error: err => console.log(err),
      complete: () => console.log('succès')
    });
  }

  getVerification(): void {
    this.verificationService.getVerification(this.auth).subscribe({
      next: value => {
        console.log(value),
        this.preference = value;

        switch (this.preference.verification) {
          case '1':
            this.preference.verification = 'Heure';
            break;
          case '2':
            this.preference.verification = 'Semaine';
            break;
          case '3':
            this.preference.verification = '2 Semaines';
            break;
          case '4':
            this.preference.verification = '3 Semaine';
            break;
          default:
            this.preference.verification = 'Mois';
        }
        switch (this.preference.notification) {
          case '1':
            this.preference.notification = 'Mail';
            break;
          default:
            this.preference.notification = 'SMS';
        }
        console.log(this.preference);
      },
      error: err => console.log(err),
      complete: () => console.log('succès')
    })
  }

  addPreference(): void {
    this.errorHourOne = '';
    this.errorHourTwo = '';
    this.errorHourThree = '';
    this.errorDate = '';
    var error = 0;
    var one_hour = moment(this.preferenceForm.value.one_hour,'HH:mm');
    var two_hour= moment(this.preferenceForm.value.two_hour,'HH:mm');
    var three_hour = moment(this.preferenceForm.value.three_hour,'HH:mm');
    var four_hour= moment(this.preferenceForm.value.four_hour,'HH:mm');
    var diff_one = two_hour.diff(one_hour);
    var diff_two = three_hour.diff(two_hour);
    var diff_three = four_hour.diff(three_hour);
    console.log(this.preferenceForm.value.two_hour);
    if(this.preferenceForm.value.verification == 1 && this.preferenceForm.value.two_hour == '') {
      this.errorHourOne = 'Il doit y avoir une seconde horaire sinon choisissez la vérification par jour !';
      error++;
    }
    if(Math.sign(diff_one) == -1) {
      this.errorHourOne = 'L\'horaire entré est inférieur à la première heure entré !';
      console.log(this.errorHourOne);
      error++;
    }
    if(Math.sign(diff_two) == -1) {
      this.errorHourTwo = 'L\'horaire entré est inférieur à la seconde heure entré !';
      error++;
    }
    if(Math.sign(diff_three) == -1) {
      this.errorHourThree = 'L\'horaire entré est inférieur à la troisième heure entré !';
      error++;
    }
    var newDate = moment(this.preferenceForm.value.verification_date).format('YYYY-DD-MM');
    if(moment(this.today).isSameOrBefore(newDate) == false) {
      this.errorDate = 'La date est inférieur à aujourd\'hui !';
      error++;
    }
    if(moment(this.today).isSame(newDate) == true) {
      var diff_horraire;
      var now = moment().format('HH:mm');
      var nowHour = moment(now,'HH:mm');
      if(this.preferenceForm.value.verification == 1) {
        if(this.preferenceForm.value.four_hour != undefined) {
          diff_horraire = four_hour.diff(nowHour);
          if(Math.sign(diff_horraire) == -1) {
            this.errorDate = 'La prochaine vérification doit se faire le lendemain, veuillez modifiez l\'horaire pour confirmer.'
            error++;
          }
        } else if(this.preferenceForm.value.three_hour != undefined) {
          diff_horraire = three_hour.diff(nowHour);
          if(Math.sign(diff_horraire) == -1) {
            this.errorDate = 'La prochaine vérification doit se faire le lendemain, veuillez modifiez l\'horaire pour confirmer.'
            error++;
          }
        } else if(this.preferenceForm.value.two_hour != undefined) {
          diff_horraire = three_hour.diff(nowHour);
          console.log(diff_horraire);
          if(Math.sign(diff_horraire) == -1) {
            this.errorDate = 'La prochaine vérification doit se faire le lendemain, veuillez modifiez l\'horaire pour confirmer.'
            error++;
          }
        }
      } else {
        diff_horraire = one_hour.diff(nowHour);
        if(Math.sign(diff_horraire) == -1) {
          this.errorDate = 'La prochaine vérification doit se faire le lendemain, veuillez modifiez l\'horaire pour confirmer.'
          error++;
        }
      }
    }
    if(error === 0) {
      this.verificationService.addVerification(this.preferenceForm.value, this.auth).subscribe({
        next: value => {
          console.log(value),
          this.getVerification()
        },
        error: err => console.log(err),
        complete: () => console.log('succès')
      })
    }

  }


}
