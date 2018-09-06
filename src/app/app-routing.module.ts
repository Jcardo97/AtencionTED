import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { EstudiantesComponent } from "./components/estudiantes/estudiantes.component";
import { ReportesComponent } from "./components/reportes/reportes.component";
import { UnderContructionComponent } from "./components/under-contruction/under-contruction.component";

const routes: Routes = [
  {path: '', redirectTo:'/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'estudiantes', component: EstudiantesComponent},
  {path: 'mantenimientos', component: UnderContructionComponent},
  {path: 'reportes', component: ReportesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
