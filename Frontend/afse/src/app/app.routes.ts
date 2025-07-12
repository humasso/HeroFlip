import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ShopdashComponent } from './shop/shopdash/shopdash.component';
import { CreditsComponent } from './shop/credits/credits.component';
import { PacchettiComponent } from './pacchetti/pacchetti.component';
import { AlbumComponent } from './album/album.component';
import { DettagliEroeComponent } from './dettagli-eroe/dettagli-eroe.component';
import { ScambiBoardComponent } from './scambi/scambi-board/scambi-board.component';
import { ScambioCreateComponent } from './scambi/scambio-create/scambio-create.component';
import { ScambioDetailComponent } from './scambi/scambio-detail/scambio-detail.component';
import { authGuard } from './auth/auth.guard';


export const routes: Routes = [
    //{ path: '', component: AppComponent },
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'shop', component: ShopdashComponent, canActivate: [authGuard] },
    { path: 'shop/credits', component: CreditsComponent, canActivate: [authGuard] },
    { path: 'pacchetti', component: PacchettiComponent, canActivate: [authGuard] },
    { path: 'album', component: AlbumComponent, canActivate: [authGuard] },
    { path: 'album/hero/:id', component: DettagliEroeComponent, canActivate: [authGuard] },
    { path: 'scambi', component: ScambiBoardComponent, canActivate: [authGuard] },
    { path: 'scambi/new', component: ScambioCreateComponent, canActivate: [authGuard] },
    { path: 'scambi/:id', component: ScambioDetailComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];