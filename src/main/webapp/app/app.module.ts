import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { OverheardGatewaySharedModule } from 'app/shared/shared.module';
import { OverheardGatewayCoreModule } from 'app/core/core.module';
import { OverheardGatewayAppRoutingModule } from './app-routing.module';
import { OverheardGatewayHomeModule } from './home/home.module';
import { OverheardGatewayEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    OverheardGatewaySharedModule,
    OverheardGatewayCoreModule,
    OverheardGatewayHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    OverheardGatewayEntityModule,
    OverheardGatewayAppRoutingModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent]
})
export class OverheardGatewayAppModule {}
