import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PredictionService} from "../service/prediction.service";
import {TeamService} from "../service/team.service";
import {LeagueService} from "../service/league.service";
import {League} from "../domain/League";
import {Team} from "../domain/Team";
import {MinMaxValues} from "../domain/MinMaxValues";

@Component({
  selector: 'app-player-match-dialog',
  templateUrl: './player-match-dialog.component.html',
  styleUrl: './player-match-dialog.component.scss'
})
export class PlayerMatchDialogComponent {

  leagues: League[] = [];
  teams: Team[] = [];
  selectedLeague: League;
  selectedTeam: Team;
  playerTeamFitMessage: string;
  predictionDone: boolean = false;
  minMaxValues: MinMaxValues;
  minOverall = 0;
  maxOverall = 0;
  playerOverall = 0;
  minPotential = 0;
  maxPotential = 0;
  playerPotential = 0;
  playerAge = 0;
  minAge = 0;
  maxAge = 0;



  constructor(public dialogRef: MatDialogRef<PlayerMatchDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private predictionService: PredictionService,
              private teamService: TeamService, private leagueService: LeagueService) {
  this.fetchLeagues();
  }

  fetchLeagues(){
    this.leagueService.getAllLeagues().subscribe((data: any) => {
      this.leagues = data;
    });
  }


  onLeagueChange() {
    this.teamService.getTeamsByLeague(this.selectedLeague.id).subscribe((data) => {
      this.teams = data;
    })
  }

  onCancel() {
    this.dialogRef.close();
  }

  predictMatch() {
    this.predictionService.predictMatchInTeam(this.data.playerID, this.selectedTeam.id).subscribe(
      data =>{
      if(data == "1"){
        this.playerTeamFitMessage = `${this.data.playerName} would be a great fit for ${this.selectedTeam.name}`;
      }else{
        this.playerTeamFitMessage = `${this.data.playerName} would NOT be a great fit for ${this.selectedTeam.name}`
      }
      this.predictionDone = true;
    });
    const fieldNames = ['overall', 'age', 'potential']
    this.predictionService.getTeamMinMaxValues(this.selectedTeam.clubId, fieldNames).subscribe(
      (data: MinMaxValues) => {
      this.minMaxValues = data;
      this.handleMinMaxValues();
    })
  }

  private handleMinMaxValues() {
    // overall
    this.playerOverall = this.data.playerOverall;
    this.minOverall = this.minMaxValues.minValues['overall'];
    this.maxOverall = this.minMaxValues.maxValues['overall'];
    // potential
    this.playerPotential = this.data.playerPotential;
    this.minPotential = this.minMaxValues.minValues['potential'];
    this.maxPotential = this.minMaxValues.maxValues['potential'];
    // age
    this.playerAge = this.data.playerAge;
    this.minAge = this.minMaxValues.minValues['age'];
    this.maxAge = this.minMaxValues.maxValues['age'];


  }
}
