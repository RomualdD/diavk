import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

import { User } from '../user';
import { UserService } from '../services/userService';

function emailMatcher(c: AbstractControl): { [key: string]: boolean} | null {
  const emailControl = c.get('mail');
  const confirmControl = c.get('confirmMail');

  if(emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  if(emailControl.value === confirmControl.value) {
    return null;
  }
  return { 'match': true}
}

function passwordMatcher(c: AbstractControl): { [key: string]: boolean} | null {
  const passwordControl = c.get('password');
  const passwordConfirmControl = c.get('confirmPassword');

  if(passwordControl.pristine || passwordConfirmControl.pristine) {
    return null;
  }

  if(passwordControl.value === passwordConfirmControl.value) {
    return null;
  }
  return { 'match': true}
}

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  userForm: FormGroup;
  user = new User();
  passwordMessage: string;
  mailMessage: string;
  messageError: string;
  validation: any = {};

  constructor(private fb: FormBuilder, private userService: UserService) { }

  private validationMessages = {
    required: 'Entrez un mot de passe.',
    match: 'Le mot de passe est différent'
  }

  private validationMailMessage = {
    required: 'Entrez une adresse mail.',
    email: 'Entrez une adresse mail valide'
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required]]
      }, {validator: passwordMatcher}),
      mailGroup: this.fb.group({
        mail: ['', [Validators.required, Validators.email]],
        confirmMail: ['', [Validators.required]]
      }),
      birthdate: '',
      phone:['', [Validators.minLength(10),Validators.maxLength(10)]],
      phone2: ['', [Validators.minLength(10),Validators.maxLength(10)]],
      role: ['', Validators.required],
      pathology:''
    });

    const passwordControl = this.userForm.get('passwordGroup.confirmPassword');
    passwordControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(passwordControl)
    )

    const emailControl = this.userForm.get('mailGroup.mail');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMailMessage(emailControl)
    )
  }

  setMessage(c: AbstractControl): void {
    this.passwordMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.passwordMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  setMailMessage(c: AbstractControl): void {
    this.mailMessage = '';
    if((c.touched || c.dirty) && c.errors) {
      this.mailMessage = Object.keys(c.errors).map(
        key => this.validationMailMessage[key]).join(' ');
    }
  }

  addUser(): void {
    if(this.userForm.value.pathology == '') {
      this.userForm.value.pathology = null;
    }
    this.userForm.value.mail = this.userForm.value.mailGroup.mail;
    this.userForm.value.password = this.userForm.value.passwordGroup.password;
    console.log(this.userForm.value);
    this.userService.addUser(this.userForm.value).subscribe({
      next: value => {
        this.validation = value;
        console.log(this.validation)
        if(this.validation.error != undefined) {
          this.messageError = this.validation.error.error;
          console.log(this.messageError)
        }
      },
      error: err => console.log(err),
      complete: () => console.log('ok')
    });
  }

}
