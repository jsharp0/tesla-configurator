import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StepService } from '../services/step.service';

export const stepGuard: CanActivateFn = (route, state) => {
  const stepService = inject(StepService);

  return route.routeConfig?.path === 'step-two'
    ? stepService.stepOneComplete()
    : route.routeConfig?.path === 'step-three'
    ? stepService.stepTwoComplete()
    : true;
};
