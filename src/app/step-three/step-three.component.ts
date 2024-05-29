import { Component, OnInit } from '@angular/core';
import { ModelService } from '../services/model.service';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'tesla-step-one',
  standalone: true,
  imports: [CurrencyPipe, UpperCasePipe],
  template: `<h1>Step 3: Summary</h1>
    <h3>Your {{ savedInfo.model?.description }}</h3>
    <table>
      <tr>
        <td>{{ savedInfo.options?.config?.description }}</td>
        <td>{{ savedInfo.options?.config?.price | currency }}</td>
      </tr>
      <tr>
        <td>{{ savedInfo.color?.description }}</td>
        <td>{{ savedInfo.color?.price | currency }}</td>
      </tr>
      @if (savedInfo.options?.canHaveTowHitch &&
      savedInfo.options?.includeTowHitch) {
      <tr>
        <td>Tow Hitch Package</td>
        <td>{{ 1000 | currency }}</td>
      </tr>
      } @if (savedInfo.options?.canHaveYoke && savedInfo.options?.includeYoke) {
      <tr>
        <td>Yoke Package</td>
        <td>{{ 1000 | currency }}</td>
      </tr>
      }
      <tr>
        <td>{{ 'Total cost' | uppercase }}</td>
        <td>{{ totalCost | currency }}</td>
      </tr>
    </table> `,
})
export class StepThreeComponent implements OnInit {
  savedInfo = this.modelService.getSavedInfo();
  totalCost = this.calculateTotalCost();

  constructor(private modelService: ModelService) {}

  ngOnInit() {}

  private calculateTotalCost() {
    let cost = 0;
    if (this.savedInfo.options && this.savedInfo.color) {
      cost += this.savedInfo.options.config.price;
      cost += this.savedInfo.color.price;
      if (this.savedInfo.options.includeTowHitch) {
        cost += 1000;
      }

      if (this.savedInfo.options.includeYoke) {
        cost += 1000;
      }
    }
    return cost;
  }
}
