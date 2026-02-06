import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissonRoleComponent } from './permisson-role.component';

describe('PermissonRoleComponent', () => {
  let component: PermissonRoleComponent;
  let fixture: ComponentFixture<PermissonRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissonRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissonRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
