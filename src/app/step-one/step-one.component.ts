import { Component, OnInit, Signal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Model } from '../interfaces/model.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModelService } from '../services/model.service';
import { StepService } from '../services/step.service';

@Component({
  selector: 'tesla-step-one',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<h1>Step 1: Choose your Model and color</h1>
    <form [formGroup]="modelInformation">
      Model:
      <select formControlName="model" id="modelSelect">
        @for (model of models(); track $index) {
        <option [value]="model.code">{{ model.description }}</option>
        }
      </select>
      Color:

      <select id="colorSelect" formControlName="color">
        @for (color of colors; track $index) {
        <option [value]="color.code">{{ color.description }}</option>
        }
      </select>
    </form> `,
})
export class StepOneComponent implements OnInit {
  models: Signal<Model[] | undefined> = signal([]);
  modelInformation = new FormGroup({
    model: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
  });

  get colors() {
    return this.models()?.find(
      (x) => x.code === this.modelInformation.value.model
    )?.colors;
  }

  constructor(
    private modelService: ModelService,
    private stepService: StepService
  ) {
    this.models = toSignal(this.modelService.getModels());
  }

  ngOnInit() {
    const savedInfo = this.modelService.getSavedInfo();
    this.modelInformation.patchValue({
      model: savedInfo.model?.code,
      color: savedInfo.color?.code,
    });
    this.autoSaveFormInfo();
  }

  private autoSaveFormInfo() {
    this.modelInformation.valueChanges.subscribe(({ model, color }) => {
      const selectedModel = this.models()?.find(({ code }) => code === model);
      const selectedColor = this.colors?.find(({ code }) => code === color);

      if (selectedModel) {
        this.modelService.saveModelDetails(selectedModel);
        this.modelService.resetColor();
      }

      if (selectedColor) {
        this.modelService.saveColorDetails(selectedColor);
      }

      if (this.modelInformation.valid) {
        this.stepService.saveStepProgress('one');
      }
    });
  }
}
