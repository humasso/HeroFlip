import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
/*
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/auth/login/login.component';
import { RegisterComponent } from './app/auth/register/register.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClient } from '@angular/common/http';
*/

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
