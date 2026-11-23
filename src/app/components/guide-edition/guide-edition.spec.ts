import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideEdition } from './guide-edition';

describe('GuideEdition', () => {
  let component: GuideEdition;
  let fixture: ComponentFixture<GuideEdition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideEdition],
    }).compileComponents();

    fixture = TestBed.createComponent(GuideEdition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
