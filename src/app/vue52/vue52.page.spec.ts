import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue52Page } from './vue52.page';

describe('Vue52Page', () => {
  let component: Vue52Page;
  let fixture: ComponentFixture<Vue52Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue52Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
