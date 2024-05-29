import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  stepOneComplete = signal(false);
  stepTwoComplete = signal(false);

  saveStepProgress(step: 'one' | 'two'): void {
    localStorage.setItem(`step-${step}`, 'complete');
    this.getStepProgress();
  }

  getStepProgress(): void {
    this.stepOneComplete.set(!!localStorage.getItem('step-one'));
    this.stepTwoComplete.set(!!localStorage.getItem('step-two'));
  }
}
