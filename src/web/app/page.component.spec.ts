import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderBarModule } from './components/loader-bar/loader-bar.module';
import { LoadingSpinnerModule } from './components/loading-spinner/loading-spinner.module';
import { StatusMessageModule } from './components/status-message/status-message.module';
import { TeammatesRouterModule } from './components/teammates-router/teammates-router.module';
import { ToastModule } from './components/toast/toast.module';
import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageComponent,
      ],
      imports: [
        NgbModule,
        LoaderBarModule,
        LoadingSpinnerModule,
        RouterTestingModule,
        TeammatesRouterModule,
        StatusMessageModule,
        ToastModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
