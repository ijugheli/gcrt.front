import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { DynamicFormModule } from 'src/modules/dynamic-form/dynamic-form.module';
import { AttributePageModule } from 'src/pages/attribute-page/attribute-page.module';
import { CaseModule } from 'src/pages/case/case.module';
import { ClientModule } from 'src/pages/client/client.module';
import { SurveyPageModule } from 'src/pages/survey-page/survey.module';
import { AuthGuardService } from 'src/services/AuthGuardService.service';
import { AuthService } from 'src/services/AuthService.service';
import { InterceptorService } from 'src/services/interceptor.service';
import { MenuModule } from '../modules/menu/menu.module';
import { AttributeFormModule } from '../pages/attribute-form/attribute-form.module';
import { AttributesStructureModule } from '../pages/attributes-structure/attributes-structure.module';
import { ChangePasswordModule } from '../pages/change-password/change-password.module';
import { HomeModule } from '../pages/home/home.module';
import { LoginModule } from '../pages/login/login/login.module';
import { ReportsModule } from '../pages/reports/reports.module';
import { UsersModule } from '../pages/users/users.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';

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
    AttributeFormModule,
    TableModule,
    TreeTableModule,
    HomeModule,
    LoginModule,
    ClientModule,
    ReportsModule,
    UsersModule,
    ChangePasswordModule,
    CaseModule,
    DynamicFormModule,
    TableModule,
    ConfirmDialogModule,
    AppRoutingModule,
    AttributesStructureModule,
    SurveyPageModule,
  ],
  providers: [ConfirmationService, DialogService, MessageService, AuthGuardService, AuthService, DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
