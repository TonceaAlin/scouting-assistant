import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PlayerService} from "../service/player.service";
import {Player} from "../domain/Player";
import {ChartData, ChartDataset, ChartOptions} from "chart.js";
import { BaseChartDirective } from 'ng2-charts';
import {PlayerImageService} from "../service/player-image.service";


@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit {
  player: Player;
  playerImageUrl: string;
  playerNationUrl: string;
  radarChartData: ChartData<'radar'>;
  radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      r: {
        angleLines: {
          display: false
        },
        grid: {
          circular: true,
          color: '#444',
        },
        pointLabels: {
          font: {
            size: 16,
            family: 'Arial',
            weight: 'bold',
          },
          color: (context) => {
            const index = context.index;
            const value = context.chart.data.datasets[0].data[index] as number;
            if (value >= 80) {
              return 'green';
            } else if (value >= 50) {
              return 'orange';
            } else {
              return 'red';
            }
          },
        },
        ticks: {
          backdropColor: 'rgba(0, 0, 0, 0)',
          color: '#FFF',
          stepSize: 20,
          showLabelBackdrop: false
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private playerImageService: PlayerImageService
  ) { }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id');
    this.fetchPlayerDetails(playerId);
  }

  fetchPlayerImage(playerId: string | null) {
    return this.playerImageService.getPlayerImageUrl(playerId);
  }

  fetchPlayerFlag(nationality: string | null){
    return this.playerImageService.getPlayerFlagUrl(nationality);
  }

  fetchPlayerDetails(playerId: string | null) {
    this.playerService.getPlayerDetails(playerId).subscribe((player: any) => {
      this.player = player;
      this.setupRadarChart();
      this.playerImageUrl = this.fetchPlayerImage(this.player.playerId);
      this.playerNationUrl = this.fetchPlayerFlag(this.player.nationalityName);
      console.log(this.playerNationUrl);
    }, error => {
      console.error('Error fetching player details:', error);
    });
  }

  getAttackingAttributes() {
    return [
      { name: 'Crossing', value: this.player?.attackingCrossing },
      { name: 'Finishing', value: this.player?.attackingFinishing },
      { name: 'Heading Accuracy', value: this.player?.attackingHeadingAccuracy },
      { name: 'Short Passing', value: this.player?.attackingShortPassing },
      { name: 'Volleys', value: this.player?.attackingVolleys },
    ];
  }

  getSkillAttributes() {
    return [
      { name: 'Dribbling', value: this.player?.skillDribbling },
      { name: 'Curve', value: this.player?.skillCurve },
      { name: 'FK Accuracy', value: this.player?.skillFkAccuracy },
      { name: 'Long Passing', value: this.player?.skillLongPassing },
      { name: 'Ball Control', value: this.player?.skillBallControl },
    ];
  }

  getMovementAttributes() {
    return [
      { name: 'Acceleration', value: this.player?.movementAcceleration },
      { name: 'Sprint Speed', value: this.player?.movementSprintSpeed },
      { name: 'Agility', value: this.player?.movementAgility },
      { name: 'Reactions', value: this.player?.movementReactions },
      { name: 'Balance', value: this.player?.movementBalance },
    ];
  }

  getPowerAttributes() {
    return [
      { name: 'Shot Power', value: this.player?.powerShotPower },
      { name: 'Jumping', value: this.player?.powerJumping },
      { name: 'Stamina', value: this.player?.powerStamina },
      { name: 'Strength', value: this.player?.powerStrength },
      { name: 'Long Shots', value: this.player?.powerLongShots },
    ];
  }

  getMentalityAttributes() {
    return [
      { name: 'Aggression', value: this.player?.mentalityAggression },
      { name: 'Interceptions', value: this.player?.mentalityInterceptions },
      { name: 'Att. Position', value: this.player?.mentalityPositioning },
      { name: 'Vision', value: this.player?.mentalityVision },
      { name: 'Penalties', value: this.player?.mentalityPenalties },
      { name: 'Composure', value: this.player?.mentalityComposure },
    ];
  }

  getDefendingAttributes() {
    return [
      { name: 'Defensive Awareness', value: this.player?.defendingMarkingAwareness },
      { name: 'Standing Tackle', value: this.player?.defendingStandingTackle },
      { name: 'Sliding Tackle', value: this.player?.defendingSlidingTackle },
    ];
  }

  getGoalkeepingAttributes() {
    return [
      { name: 'GK Diving', value: this.player?.goalkeepingDiving },
      { name: 'GK Handling', value: this.player?.goalkeepingHandling },
      { name: 'GK Kicking', value: this.player?.goalkeepingKicking },
      { name: 'GK Positioning', value: this.player?.goalkeepingPositioning },
      { name: 'GK Reflexes', value: this.player?.goalkeepingReflexes },
    ];
  }

  getColorClass(value: number): string {
    if (value >= 80) {
      return 'high';
    } else if (value >= 50) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  getStars(value: number): string {
    const maxStars = 5;
    return '★'.repeat(<number>value) + '☆'.repeat(maxStars - value);
  }

  setupRadarChart() {
    const labels: string[] = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physical'];
    const data: number[] = [
      this.player?.pace ?? 0,
      this.player?.shooting ?? 0,
      this.player?.passing ?? 0,
      this.player?.dribbling ?? 0,
      this.player?.defending ?? 0,
      this.player?.physic ?? 0
    ];

    const datasets = [
      {
        label: this.player?.shortName,
        data: data,
        backgroundColor: 'rgba(0, 123, 255, 0.4)',
        borderColor: 'rgba(0, 123, 255, 1)',
        pointBackgroundColor: 'rgba(0, 123, 255, 1)'
      }
    ];

    this.radarChartData = {
      labels: labels,
      datasets: datasets
    };
  }

}
