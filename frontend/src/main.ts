import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { App } from './app/app';
import { RegisterComponent } from './app/components/register/register.component';
import { LoginComponent } from './app/components/login/login.component';
import { ToyListComponent } from './app/components/toy-list/toy-list.component';

import { AuthService } from './app/core/services/auth/auth.service';
import { ApiService } from './app/core/services/api/api.service';
import { ToyService } from './app/core/services/toy/toy.service';
import { ToyDetailComponent } from './app/components/toy-detail/toy-detail.component';
import { AdminComponent } from './app/components/admin/admin.component';
import { AdminService } from './app/core/services/admin/admin.service';
import { AdminGuard } from './app/core/guards/admin.guard';
import { NoAuthGuard } from './app/core/guards/no-auth.guard';
import { CartComponent } from './app/components/cart/cart.component';
import { AuthGuard } from './app/core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'toys', pathMatch: 'full' },
 { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'toys', component: ToyListComponent },
    { path: 'toys/:id', component: ToyDetailComponent },
{ path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
{path:'cart', component:CartComponent,canActivate:[AuthGuard]}

];

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes, { useHash: true }), // ✅ hash routing
      ReactiveFormsModule,
      HttpClientModule,
      CommonModule // ✅ omogućava *ngFor i ngIf
    ),
    AuthService,
    ApiService,
    ToyService,
    AdminService,
  ]
})
.catch(err => console.error(err));
