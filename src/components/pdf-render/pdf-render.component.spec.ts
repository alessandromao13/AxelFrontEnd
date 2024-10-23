import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfRenderComponent } from './pdf-render.component';

describe('PdfRenderComponent', () => {
  let component: PdfRenderComponent;
  let fixture: ComponentFixture<PdfRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfRenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
