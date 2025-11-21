import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue2xPage } from './vue2x.page';

describe('Vue2xPage', () => {
  let component: Vue2xPage;
  let fixture: ComponentFixture<Vue2xPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue2xPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
