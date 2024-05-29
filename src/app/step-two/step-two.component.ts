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
import { Options, SavedOptions } from '../interfaces/options.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'tesla-step-one',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `<h1>Step 2: Select your config and options</h1>
    <form [formGroup]="configInformation">
      Config:
      <select formControlName="config" id="configSelect">
        @for (config of options()?.configs; track $index) {
        <option [ngValue]="config.id">
          {{ config.description }}
        </option>
        }
      </select>
      <br />
      @if (selectedConfig; as config) { Range:
      {{ config.range }} - Max speed: {{ config.speed }} - Cost:
      {{ config.price | currency }}
      } @if (this.options()?.towHitch) {
      <input
        formControlName="includeTowHitch"
        id="includeTow"
        type="checkbox"
      />
      Tow hitch? } @if (this.options()?.yoke) {
      <input formControlName="includeYoke" type="checkbox" id="includeYoke" />
      Yoke? }
    </form> `,
})
export class StepTwoComponent implements OnInit {
  options: Signal<Options | undefined> = signal(undefined);
  savedInfo: {
    model: Model | undefined;
    options: SavedOptions | undefined;
  };
  configInformation = new FormGroup({
    config: new FormControl(0, Validators.required),
    includeTowHitch: new FormControl(false),
    includeYoke: new FormControl(false),
  });

  get selectedConfig() {
    return this.options()?.configs.find(
      (c) => c.id === this.configInformation.value.config
    );
  }

  constructor(
    private modelService: ModelService,
    private stepService: StepService
  ) {
    this.savedInfo = this.modelService.getSavedInfo();
    if (this.savedInfo.model) {
      this.options = toSignal(
        this.modelService.getConfigOptions(this.savedInfo.model.code)
      );
    }
  }

  ngOnInit() {
    this.configInformation.patchValue({
      ...this.savedInfo.options,
      config: this.savedInfo.options?.config.id,
    });

    this.autoSaveFormInfo();
  }

  private autoSaveFormInfo() {
    this.configInformation.valueChanges.subscribe(() => {
      if (this.configInformation.valid) {
        this.modelService.saveConfig({
          ...this.configInformation.value,
          config: this.selectedConfig,
          canHaveTowHitch: this.options()?.towHitch,
          canHaveYoke: this.options()?.yoke,
        } as SavedOptions);

        this.stepService.saveStepProgress('two');
      }
    });
  }
}
