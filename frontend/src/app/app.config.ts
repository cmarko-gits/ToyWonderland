import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig = {
  providers: [
    provideRouter([
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'register', pathMatch: 'full' },
    ]),
    provideHttpClient(withFetch()), 
    importProvidersFrom(ReactiveFormsModule)
  ]
};
