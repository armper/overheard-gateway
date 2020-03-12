import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'app/core/user/account.model';
import { Subscription } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ITopic } from 'app/shared/model/topic.model';
import { AccountService } from 'app/core/auth/account.service';
import { PostService } from '../post/post.service';
import { IPost } from 'app/shared/model/post.model';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { JhiParseLinks } from 'ng-jhipster';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-topic-detail',
  templateUrl: './topic-detail.component.html'
})
export class TopicDetailComponent implements OnInit {
  topic: ITopic | null = null;
  postSubscription!: Subscription;
  account!: Account;
  posts: IPost[];
  page: number;
  itemsPerPage: number;
  predicate: string;
  links: any;
  ascending: boolean;

  constructor(
    protected parseLinks: JhiParseLinks,
    private userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    private postService: PostService
  ) {
    this.posts = [];
    this.page = 0;
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.predicate = 'id';
    this.ascending = true;
    this.links = {
      last: 0
    };
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ topic }) => (this.topic = topic));
    this.accountService.getAuthenticationState().subscribe(account => (this.account = account!));
    this.postSubscription = this.postService
      .query({
        page: '0',
        size: '10',
        sort: ['id,desc'],
        'topicId.equals': this.topic!.id
      })
      .subscribe(posts => (this.posts = posts.body!));
  }

  previousState(): void {
    window.history.back();
  }

  public isAdmin(): boolean | undefined {
    return this.account.authorities.includes('ROLE_ADMIN');
  }

  loadAll(): void {
    this.postService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IPost[]>) => this.paginatePosts(res.body, res.headers));
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  reset(): void {
    this.page = 0;
    this.posts = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  protected paginatePosts(data: IPost[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.posts.push(data[i]);
      }
    }
  }

  upRank(post: IPost, rank: number): void {
    // Only logged in users can upvote
    if (!this.account) {
      return;
    }

    this.userService.find(this.account.login).subscribe(user => {
      this.postService.query({ 'userUprankId.in': user.id }).subscribe(uprankedPosts => {
        if (uprankedPosts.body!.length === 0) {
          this.postService.find(post.id!).subscribe(pp => {
            post.userUpranks = pp.body!.userUpranks;

            switch (rank) {
              case 1:
                post.rankOne!++;
                break;
              case 2:
                post.rankTwo!++;
                break;
              case 3:
                post.rankThree!++;
                break;
              case 4:
                post.rankFour!++;
                break;
              case 5:
                post.rankFive!++;
                break;
            }

            post.userUpranks!.push(user);
            this.postService.update(post).subscribe(updatePost => {
              updatePost.body;
              // eslint-disable-next-line no-console
              console.log(updatePost.body);
            });
          });
        } else {
          const urps: IPost[] = uprankedPosts.body!.filter(urp => urp.id === post.id);

          if (urps.length === 0) {
            this.postService.find(post.id!).subscribe(pp => {
              post.userUpranks = pp.body!.userUpranks;

              switch (rank) {
                case 1:
                  post.rankOne!++;
                  break;
                case 2:
                  post.rankTwo!++;
                  break;
                case 3:
                  post.rankThree!++;
                  break;
                case 4:
                  post.rankFour!++;
                  break;
                case 5:
                  post.rankFive!++;
                  break;
              }

              post.userUpranks!.push(user);
              this.postService.update(post).subscribe(updatePost => {
                updatePost.body;
                // eslint-disable-next-line no-console
                console.log(updatePost.body);
              });
            });
          }
        }
      });
    });
  }
}
