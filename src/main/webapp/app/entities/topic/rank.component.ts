import { Component, OnInit, Input } from '@angular/core';
import { Rank } from './rank';

@Component({
  selector: 'jhi-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent implements OnInit {
  @Input()
  rank!: Rank;

  constructor() {}

  ngOnInit(): void {}
}
