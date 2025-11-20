import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue50Page } from './vue50.page';

describe('Vue50Page', () => {
  let component: Vue50Page;
  let fixture: ComponentFixture<Vue50Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue50Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
