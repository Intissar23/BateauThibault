import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue3Page } from './vue3.page';

describe('Vue3Page', () => {
  let component: Vue3Page;
  let fixture: ComponentFixture<Vue3Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
