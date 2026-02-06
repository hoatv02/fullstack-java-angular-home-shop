import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPasswordByEMailComponent } from './new-password-by-email.component';


describe('NewPasswordByEmailComponent', () => {
  let component: NewPasswordByEMailComponent;
  let fixture: ComponentFixture<NewPasswordByEMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordByEMailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewPasswordByEMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
