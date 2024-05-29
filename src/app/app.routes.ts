import { Routes } from '@angular/router';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { stepGuard } from './guard/step.guard';

export const routes: Routes = [
  {
    path: 'step-one',
    component: StepOneComponent,
  },
  {
    path: 'step-two',
    component: StepTwoComponent,
    canActivate: [stepGuard],
  },
  {
    path: 'step-three',
    component: StepThreeComponent,
    canActivate: [stepGuard],
  },
  { path: '', component: StepOneComponent, pathMatch: 'full' },
  { path: '**', component: StepOneComponent },
];
