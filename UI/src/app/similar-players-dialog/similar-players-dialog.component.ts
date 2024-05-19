import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PredictionService} from "../service/prediction.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-similar-players-dialog',
  templateUrl: './similar-players-dialog.component.html',
  styleUrl: './similar-players-dialog.component.scss'
})
export class SimilarPlayersDialogComponent {
  predictedPlayers: any[] = [];
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<SimilarPlayersDialogComponent>, public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, public predictionService: PredictionService) {}

  ngOnInit(): void {
    // Fetch predicted players when the component initializes
    this.fetchPredictedPlayers();
  }

  fetchPredictedPlayers() {
    // Fetch predicted players using the prediction service
    this.predictionService.getSimilarPlayers(this.data.playerID).subscribe((players: any[]) => {
        this.predictedPlayers = players;
        this.loading = false;
      }, error => {
        console.error('Error fetching predicted players:', error);
        this.loading = false;
      });
  }

  navigateToDetails(id: any) {
    this.router.navigate(['/player-details', id]).then();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
