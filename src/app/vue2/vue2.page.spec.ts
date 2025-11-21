import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue2Page } from './vue2.page';

describe('Vue2Page', () => {
  let component: Vue2Page;
  let fixture: ComponentFixture<Vue2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
