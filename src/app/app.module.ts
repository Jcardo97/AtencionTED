import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http } from "@angular/http";
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MenuComponent } from './components/menu/menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';

import { StudentAtentionService } from "./service/student-atention.service";
import { TablaEstudiantesComponent } from './components/tabla-estudiantes/tabla-estudiantes.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { UnderContructionComponent } from './components/under-contruction/under-contruction.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DashboardComponent,
    EstudiantesComponent,
    TablaEstudiantesComponent,
    ReportesComponent,
    UnderContructionComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,

  ],
  exports: [
    MenuComponent
  ],
  providers: [StudentAtentionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
