import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue1Page } from './vue1.page';

describe('Vue1Page', () => {
  let component: Vue1Page;
  let fixture: ComponentFixture<Vue1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
