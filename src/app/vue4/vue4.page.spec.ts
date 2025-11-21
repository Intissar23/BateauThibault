import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue4Page } from './vue4.page';

describe('Vue4Page', () => {
  let component: Vue4Page;
  let fixture: ComponentFixture<Vue4Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
