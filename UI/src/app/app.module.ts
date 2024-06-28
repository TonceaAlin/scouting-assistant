import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PlayerTableComponent } from './player-table/player-table.component';
import { PlayerMatchDialogComponent } from './player-match-dialog/player-match-dialog.component';
import { SimilarPlayersDialogComponent } from './similar-players-dialog/similar-players-dialog.component';
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {PlayerService} from "./service/player.service";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {PredictionService} from "./service/prediction.service";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { RegisterComponent } from './register/register.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import { PriceRangeIndicatorComponent } from './price-range-indicator/price-range-indicator.component';
import {MatTabsModule} from "@angular/material/tabs";
import { PlayerDetailsComponent } from './player-details/player-details.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {NgChartsModule} from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    PlayerTableComponent,
    PlayerMatchDialogComponent,
    SimilarPlayersDialogComponent,
    LoginComponent,
    RegisterComponent,
    ToolbarComponent,
    PriceRangeIndicatorComponent,
    PlayerDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    FormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatGridListModule,
    NgChartsModule
  ],
  providers: [
    provideAnimationsAsync(),
    PlayerService,
    PredictionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
