import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit{
  username: string | null = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const authString = localStorage.getItem('authString');
    if (authString) {
      const decodedAuth = atob(authString);
      this.username = this.authService.getUsername();
    }
  }

  goBack(): void {
    this.router.navigate(['../']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
