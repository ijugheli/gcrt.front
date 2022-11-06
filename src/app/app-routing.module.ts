import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/pages/login/login/login.component';
import { MainComponent } from 'src/pages/main/main/main.component';

import { HomeComponent } from '../pages/home/home.component';
import { AttributePageComponent } from '../pages/attribute-page/attribute-page.component';
import { 
  AuthGuardService as AuthGuard 
} from 'src/services/AuthGuardService.service';
const routes: Routes = [
  { path: '', redirectTo: '/manage/1', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { 
    path: 'manage/:attr_id', 
    component: AttributePageComponent, 
    canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
