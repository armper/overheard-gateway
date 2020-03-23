import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { IPost } from 'app/shared/model/post.model';
import { PostService } from '../post/post.service';
import { UserService } from 'app/core/user/user.service';
import { Account } from 'app/core/user/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Rank } from './rank';

@Component({
  selector: 'jhi-up-rank-post',
  templateUrl: './up-rank-post.component.html',
  styleUrls: ['./up-rank-post.component.scss']
})
export class UpRankPostComponent implements OnInit, OnChanges {
  @Input()
  post!: IPost;

  ranks: Rank[] = [];

  selectedRank!: Rank;

  account!: Account;

  rankSum!: number;

  constructor(protected postService: PostService, protected userService: UserService, protected accountService: AccountService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.post = changes.post.currentValue;

    this.ranks = [
      { rankType: '👍', value: this.post.rankOne! },
      { rankType: '❤️', value: this.post.rankTwo! },
      { rankType: '😂', value: this.post.rankThree! },
      { rankType: '🤯', value: this.post.rankFour! },
      { rankType: '😠', value: this.post.rankFive! }
    ];

    this.ranks.sort((a, b) => b.value - a.value);

    this.rankSum = this.post.rankOne! + this.post.rankTwo! + this.post.rankThree! + this.post.rankFour! + this.post.rankFive!;
  }

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => (this.account = account!));
  }

  upRank(rank: Rank): void {
    if (!this.account) {
      return;
    }

    this.selectedRank = rank;

    this.userService.find(this.account.login).subscribe(user => {
      this.postService.query({ 'userUprankId.in': user.id }).subscribe(uprankedPostsReq => {
        if (
          uprankedPostsReq.body!.length === 0 ||
          uprankedPostsReq.body!.filter(uprankedPost => uprankedPost.id === this.post.id).length === 0
        ) {
          this.postService.find(this.post.id!).subscribe(postReq => {
            this.post = postReq.body!;
            switch (this.selectedRank.rankType) {
              case '👍':
                this.post.rankOne!++;
                break;
              case '❤️':
                this.post.rankTwo!++;
                break;
              case '😂':
                this.post.rankThree!++;
                break;
              case '🤯':
                this.post.rankFour!++;
                break;
              case '😠':
                this.post.rankFive!++;
                break;
            }
            this.post.userUpranks!.push(user);
            this.postService.update(this.post).subscribe(updatePost => {
              this.post = updatePost.body!;
            });
          });
        }
      });
    });
  }
}
