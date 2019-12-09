import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { User } from '../user';
import { UserService } from '../services/userService';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  userForm: FormGroup;
  user = new User();
  messageError: string;
  validation: any = {};

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      mail: ['',[Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login(): void {
    this.userService.login(this.userForm.value).subscribe({
      next: value => {
        this.validation = value;
        console.log(this.validation)
        if(this.validation.error != undefined) {
          this.messageError = this.validation.error.error;
          console.log(this.messageError)
        } else {
          localStorage.setItem('Auth', this.validation.token);
          this.router.navigate(['/profil']);
        }
      },
      error: err => console.log(err),
      complete: () => console.log('ok')
    })
  }

}
