import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCreationPageComponent } from './graph-creation-page.component';

describe('GraphCreationPageComponent', () => {
  let component: GraphCreationPageComponent;
  let fixture: ComponentFixture<GraphCreationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphCreationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
