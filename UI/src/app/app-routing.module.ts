import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlayerTableComponent} from "./player-table/player-table.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {path: 'home', component: PlayerTableComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
