import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ModelService } from './services/model.service';
import { StepService } from './services/step.service';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrl: 'app.component.scss',
  imports: [FormsModule, RouterOutlet, RouterModule, AsyncPipe],
  template: `
    <nav>
      <ul>
        <li><a routerLink="step-one" id="step1">Step 1</a></li>
        <li>
          <a
            routerLink="step-two"
            [class.disabled]="!stepOneComplete()"
            id="step2"
            >Step 2</a
          >
        </li>
        <li>
          <a
            routerLink="step-three"
            [class.disabled]="!stepTwoComplete()"
            id="step3"
            >Step 3</a
          >
        </li>
      </ul>
    </nav>
    <router-outlet />

    @if (selectedInfo$ | async; as selectedInfo) { @if (selectedInfo.color &&
    selectedInfo.model) {
    <img
      [src]="
        'https://interstate21.com/tesla-app/images/' +
        selectedInfo.model.code +
        '/' +
        selectedInfo.color.code +
        '.jpg'
      "
    />
    } }
  `,
  providers: [],
})
export class AppComponent implements OnInit {
  stepOneComplete = this.stepService.stepOneComplete;
  stepTwoComplete = this.stepService.stepTwoComplete;
  selectedInfo$ = combineLatest([
    this.modelService.selectedModel,
    this.modelService.selectedColor,
  ]).pipe(map(([model, color]) => ({ model, color })));

  constructor(
    private stepService: StepService,
    private modelService: ModelService
  ) {}

  ngOnInit(): void {
    this.stepService.getStepProgress();
    this.modelService.getSavedInfo();
  }
}
