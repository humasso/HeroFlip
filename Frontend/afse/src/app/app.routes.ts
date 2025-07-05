import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ShopdashComponent } from './shop/shopdash/shopdash.component';
import { CreditsComponent } from './shop/credits/credits.component';
import { PacchettiComponent } from './pacchetti/pacchetti.component';


export const routes: Routes = [
    //{ path: '', component: AppComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'shop', component: ShopdashComponent },
    { path: 'shop/credits', component: CreditsComponent },
    { path: 'pacchetti', component: PacchettiComponent },
    { path: '**', redirectTo: '' }
];
