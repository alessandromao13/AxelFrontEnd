import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningDialogComponentComponent } from './warning-dialog-component.component';

describe('WarningDialogComponentComponent', () => {
  let component: WarningDialogComponentComponent;
  let fixture: ComponentFixture<WarningDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarningDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
