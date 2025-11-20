import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vue51Page } from './vue51.page';

describe('Vue51Page', () => {
  let component: Vue51Page;
  let fixture: ComponentFixture<Vue51Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Vue51Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
