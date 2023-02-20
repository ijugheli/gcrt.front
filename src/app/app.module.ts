import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuModule } from '../modules/menu/menu.module';
import { TableModule } from 'primeng/table';
import { HomeModule } from '../pages/home/home.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AttributePageModule } from 'src/pages/attribute-page/attribute-page.module';
import { AuthGuardService } from 'src/services/AuthGuardService.service';
import { AuthService } from 'src/services/AuthService.service';
import { LoginModule } from '../pages/login/login/login.module';
import { ReportsModule } from '../pages/reports/reports.module';
import { UsersModule } from '../pages/users/users.module';
import { ChangePasswordModule } from '../pages/change-password/change-password.module';
import { ManageUserModule } from '../pages/users/manage-user/manage-user.module';
import { TreeTableModule } from 'primeng/treetable';
import { AttributeFormModule } from '../pages/attribute-form/attribute-form.module';
import { DynamicFormModule } from 'src/modules/dynamic-form/dynamic-form.module';
import { AttributesStructureModule } from '../pages/attributes-structure/attributes-structure.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ManageUserPermissionsModule } from 'src/pages/users/manage-permissions/manage-permissions.module';
import { InterceptorService } from 'src/services/interceptor.service';
import { ManageObjectModule } from '../modules/manage-object/manage-object.module';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { RecordsService } from 'src/services/attributes/Records.service';
import { UserService } from 'src/services/user.service';

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
    ReportsModule,
    UsersModule,
    ChangePasswordModule,
    DynamicFormModule,
    TableModule,
    ConfirmDialogModule,
    ManageUserModule,
    AppRoutingModule,
    AttributesStructureModule,
    ManageUserPermissionsModule
  ],
  providers: [ConfirmationService, DialogService, MessageService, AuthGuardService, AuthService,
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
