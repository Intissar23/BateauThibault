import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue53Page } from './vue53.page';

describe('Vue53Page', () => {
  let component: Vue53Page;
  let fixture: ComponentFixture<Vue53Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue53Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
