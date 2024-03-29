import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/pages/login/login/login.component';
import { HomeComponent } from '../pages/home/home.component';
import { AttributePageComponent } from '../pages/attribute-page/attribute-page.component';
import { AuthGuardService as AuthGuard } from 'src/services/AuthGuardService.service';
import { ReportsComponent } from 'src/pages/reports/reports.component';
import { UsersComponent } from '../pages/users/users.component';
import { ChangePasswordComponent } from '../pages/change-password/change-password.component';
import { ManageUserComponent } from 'src/pages/users/manage-user/manage-user.component';
import { AttributeFormComponent } from '../pages/attribute-form/attribute-form.component';
import { AttributesStructureComponent } from '../pages/attributes-structure/attributes-structure.component';
import { ManageUserPermissionsComponent } from 'src/pages/users/manage-permissions/manage-permissions.component';
import { ForgotPasswordComponent } from 'src/pages/login/forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from 'src/pages/login/update-password/update-password.component';
import { OTPComponent } from 'src/pages/login/otp/otp.component';
import { SurveyComponent } from 'src/pages/survey-page/survey.component';
import { UserReportComponent } from 'src/pages/users/users/user-report.component';
import { ClientComponent } from 'src/pages/client/client.component';
import { ClientFormComponent } from 'src/pages/client/client-form/client-form.component';
import { CaseComponent } from 'src/pages/case/case.component';
import { CaseFormComponent } from 'src/pages/case/case-form/case-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'otp', component: OTPComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'update-password', component: UpdatePasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'manage/:attr_id',
    component: AttributePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'structure/:type_id',
    component: AttributesStructureComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'edit/:attr_id/:value_id',
  //   component: AttributeFormComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'add/:attr_id',
  //   component: AttributeFormComponent,
  //   canActivate: [AuthGuard]
  // },
  { path: 'client', component: ClientComponent, canActivate: [AuthGuard] },
  { path: 'client/add', component: ClientFormComponent, canActivate: [AuthGuard] },
  { path: 'client/edit/:id', component: ClientFormComponent, canActivate: [AuthGuard] },
  { path: 'case', component: CaseComponent, canActivate: [AuthGuard] },
  { path: 'case/add', component: CaseFormComponent, canActivate: [AuthGuard] },
  { path: 'case/edit/:id', component: CaseFormComponent, canActivate: [AuthGuard] },
  { path: 'survey/:survey_id', component: SurveyComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'reports/users', component: UserReportComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/add', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/edit/:user_id', component: ManageUserComponent, canActivate: [AuthGuard] },
  { path: 'users/permissions/:user_id', component: ManageUserPermissionsComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
