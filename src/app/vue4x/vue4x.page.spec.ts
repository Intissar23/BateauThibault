import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue4xPage } from './vue4x.page';

describe('Vue4xPage', () => {
  let component: Vue4xPage;
  let fixture: ComponentFixture<Vue4xPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue4xPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
