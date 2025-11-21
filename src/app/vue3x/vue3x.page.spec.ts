import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue3xPage } from './vue3x.page';

describe('Vue3xPage', () => {
  let component: Vue3xPage;
  let fixture: ComponentFixture<Vue3xPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue3xPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
