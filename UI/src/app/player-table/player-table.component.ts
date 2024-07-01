import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PlayerService } from "../service/player.service";
import { Player } from "../domain/Player";
import { MatDialog } from "@angular/material/dialog";
import { PlayerMatchDialogComponent } from "../player-match-dialog/player-match-dialog.component";
import { SimilarPlayersDialogComponent } from "../similar-players-dialog/similar-players-dialog.component";
import { Router } from "@angular/router";
import { debounceTime, Subject } from 'rxjs';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss']
})
export class PlayerTableComponent implements OnInit {
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  displayedColumns: string[] = ['shortName', 'overall', 'value_eur', 'compare', 'similar', 'details'];
  currentPage = 0;
  pageSize = 10;
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject();


  @ViewChild('tableBody') tableBody: ElementRef;

  constructor(private playerService: PlayerService, public dialog: MatDialog, private router: Router,
              ) {}

  ngOnInit() {
    this.players = [];
    this.loadPlayers();

    this.searchSubject.pipe(debounceTime(500)).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 0;
      this.filteredPlayers = [];
      if (term) {
        this.searchPlayers();
      } else {
        this.loadPlayers();
      }
    });
  }

  onScroll() {
    if (this.tableBody.nativeElement.scrollHeight <= this.tableBody.nativeElement.scrollTop + this.tableBody.nativeElement.clientHeight) {
      this.loadMore();
    }
  }

  private loadPlayers() {
    this.playerService.getAllPlayers(this.currentPage, this.pageSize).subscribe((data: Player[]) => {
      this.filteredPlayers = [...this.filteredPlayers, ...data];
      this.players = [...this.players, ...data];
    });
  }

  private searchPlayers() {
    this.playerService.searchPlayers(this.searchTerm, this.currentPage, this.pageSize).subscribe((data: Player[]) => {
      this.filteredPlayers = [...this.filteredPlayers, ...data];
    });
  }

  private loadMore() {
    this.currentPage++;
    if (this.searchTerm) {
      this.searchPlayers();
    } else {
      this.loadPlayers();
    }
  }

  openDialog(player: any) {
    const dialogRef = this.dialog.open(PlayerMatchDialogComponent, {
      data: { playerID: player.id, playerName: player.shortName, playerOverall: player.overall, playerPotential: player.potential,
      playerAge: player.age }
    });
  }

  openSimilarDialog(id: any, shortName: string) {
    const dialogRef = this.dialog.open(SimilarPlayersDialogComponent, {
      data: { playerID: id, playerName: shortName }
    });
  }

  navigateToDetails(id: any) {
    this.router.navigate(['/player-details', id]).then();
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchSubject.next(searchTerm);
  }
}
