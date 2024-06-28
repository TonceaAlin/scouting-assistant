import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PredictionService} from "../service/prediction.service";
import {Router} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-similar-players-dialog',
  templateUrl: './similar-players-dialog.component.html',
  styleUrl: './similar-players-dialog.component.scss'
})
export class SimilarPlayersDialogComponent {
  predictedPlayers: any[] = [];
  predictedPlayersTab2: any[] = [];
  predictedPlayersTab3: any[] = [];
  loading = true;
  selectedIndex = 0

  constructor(
    public dialogRef: MatDialogRef<SimilarPlayersDialogComponent>, public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, public predictionService: PredictionService) {}

  ngOnInit(): void {
    // Fetch predicted players when the component initializes
    this.fetchPredictedPlayers('general');
  }

  fetchPredictedPlayers(criteria: string) {
    // Fetch predicted players using the prediction service
    this.predictionService.getSimilarPlayers(this.data.playerID, criteria).subscribe((players: any[]) => {
        if(criteria === "general"){
            this.predictedPlayers = players;
        }else if(criteria === "younger"){
            this.predictedPlayersTab2 = players;
        }else if(criteria === "cheaper"){
            this.predictedPlayersTab3 = players;
        }
        this.loading = false;
      }, error => {
        console.error('Error fetching predicted players:', error);
        this.loading = false;
      });
  }

    onTabChange(event: MatTabChangeEvent) {
        this.loading = true;
        this.selectedIndex = event.index;
        let criteria = 'general';
        if (this.selectedIndex === 1) {
            criteria = 'younger';
        } else if (this.selectedIndex === 2) {
            criteria = 'cheaper';
        }
        this.fetchPredictedPlayers(criteria);
    }

  navigateToDetails(id: any) {
    this.closeDialog()
    this.router.navigate(['/player-details', id]).then();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
