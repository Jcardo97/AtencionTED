import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEstudiantesComponent } from './tabla-estudiantes.component';

describe('TablaEstudiantesComponent', () => {
  let component: TablaEstudiantesComponent;
  let fixture: ComponentFixture<TablaEstudiantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaEstudiantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
