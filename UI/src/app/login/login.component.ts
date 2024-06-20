import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  private baseUrl: string = 'http://localhost:8080/api';
  private basicUrl: string = 'http://localhost:8080';

  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

  onSubmit() {
    const authString = btoa(`${this.username}:${this.password}`);
    const headers = new HttpHeaders().set('Authorization', `Basic ${authString}`);

    this.httpClient.post(`${this.baseUrl}/login`, {}, { headers: headers, responseType: 'text' })
      .subscribe(
        response => {
          this.authService.login(this.username, this.password);
          this.router.navigate(['/home']); // Replace with your protected route
        },
        error => {
          console.error('Login failed', error);
        }
      );
  }

  navigateToRegister() {
    this.router.navigate(['/register'])
  }

  loginWithGoogle() {
    // console.log("wtf")
    window.location.href = `${this.basicUrl}/oauth2/authorization/google`;
  }
}
