import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue5Page } from './vue5.page';

describe('Vue5Page', () => {
  let component: Vue5Page;
  let fixture: ComponentFixture<Vue5Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue5Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
