import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'overheard-comment',
        loadChildren: () => import('./overheard-comment/overheard-comment.module').then(m => m.OverheardGatewayOverheardCommentModule)
      },
      {
        path: 'post',
        loadChildren: () => import('./post/post.module').then(m => m.OverheardGatewayPostModule)
      },
      {
        path: 'topic',
        loadChildren: () => import('./topic/topic.module').then(m => m.OverheardGatewayTopicModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class OverheardGatewayEntityModule {}
