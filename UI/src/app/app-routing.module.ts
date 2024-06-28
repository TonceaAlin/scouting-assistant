import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlayerTableComponent} from "./player-table/player-table.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./auth.guard";
import {PlayerDetailsComponent} from "./player-details/player-details.component";

const routes: Routes = [
  {path: 'home', component: PlayerTableComponent, canActivate: [authGuard]},
  {path: 'register', component: RegisterComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'player-details/:id', component: PlayerDetailsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
