import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuModule } from '../modules/menu/menu.module';
import { TableModule } from 'primeng/table';
import { HomeModule } from '../pages/home/home.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { AttributePageModule } from 'src/pages/attribute-page/attribute-page.module';
import { AuthGuardService } from 'src/services/AuthGuardService.service';
import { AuthService } from 'src/services/AuthService.service';
import { LoginModule } from '../pages/login/login/login.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MenuModule,
    AttributePageModule,
    HomeModule,
    LoginModule,
    TableModule,
    ConfirmDialogModule,
    AppRoutingModule,
  ],
  providers: [ConfirmationService, AuthGuardService, AuthService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
