import { Component, OnInit } from '@angular/core';

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';


import { User } from '../user';
import { UserService } from '../services/userService';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  auth: any;
  user= new User();

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.auth = localStorage.getItem('Auth');
    if(this.auth != null)
      this.getUser();
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

  disconnect(): void {
    this.auth = localStorage.removeItem('Auth');
    this.router.navigate(['/']);
  }

}
