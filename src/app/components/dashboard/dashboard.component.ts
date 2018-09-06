import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  folders = [
    {
      name: 'Universidad Fidélitas',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Sistema Académico',
      href: 'sa.ufidelitas.ac.cr',
    },
    {
      name: 'Campus Virtual',
      updated: new Date('1/28/16'),
    }
  ];
  
  
}
