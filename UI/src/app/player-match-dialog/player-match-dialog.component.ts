import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PredictionService} from "../service/prediction.service";
import {TeamService} from "../service/team.service";
import {LeagueService} from "../service/league.service";
import {League} from "../domain/League";
import {Team} from "../domain/Team";

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
    this.predictionService.predictMatchInTeam(this.data.playerID, this.selectedTeam.id).subscribe(data =>{
      if(data == "1"){
        this.playerTeamFitMessage = `${this.data.playerName} would be a great fit for ${this.selectedTeam.name}`;
      }else{
        this.playerTeamFitMessage = `${this.data.playerName} would NOT be a great fit for ${this.selectedTeam.name}`
      }
      this.predictionDone = true;
    });
  }
}
