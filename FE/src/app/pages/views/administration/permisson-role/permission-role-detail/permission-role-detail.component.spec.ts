import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionRoleDetailComponent } from './permission-role-detail.component';

describe('PermissionRoleDetailComponent', () => {
  let component: PermissionRoleDetailComponent;
  let fixture: ComponentFixture<PermissionRoleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionRoleDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionRoleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
