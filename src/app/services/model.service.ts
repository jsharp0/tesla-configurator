import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Model } from '../interfaces/model.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Color } from '../interfaces/color.interface';
import { Options, SavedOptions } from '../interfaces/options.interface';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  models: Model[] = [];
  selectedModel = new BehaviorSubject<Model | null>(null);
  selectedColor = new BehaviorSubject<Color | null>(null);

  constructor(private http: HttpClient) {}

  getModels(): Observable<Model[]> {
    return this.http
      .get<Model[]>('/models')
      .pipe(tap((models) => (this.models = models)));
  }

  getConfigOptions(modelCode: string): Observable<Options> {
    return this.http.get<Options>(`/options/${modelCode}`);
  }

  saveModelDetails(model: Model): void {
    this.selectedModel.next(model);
    localStorage.setItem('selectedModel', JSON.stringify(model));
  }

  saveColorDetails(color: Color): void {
    this.selectedColor.next(color);
    localStorage.setItem('selectedColor', JSON.stringify(color));
  }

  saveConfig(config: SavedOptions): void {
    localStorage.setItem('options', JSON.stringify(config));
  }

  getSavedInfo(): {
    model: Model | undefined;
    color: Color | undefined;
    options: SavedOptions | undefined;
  } {
    const model = localStorage.getItem('selectedModel');
    const color = localStorage.getItem('selectedColor');
    const options = localStorage.getItem('options');

    this.selectedModel.next(model ? JSON.parse(model) : undefined);
    this.selectedColor.next(color ? JSON.parse(color) : undefined);

    return {
      model: model ? (JSON.parse(model) as Model) : undefined,
      color: color ? (JSON.parse(color) as Color) : undefined,
      options: options ? (JSON.parse(options) as SavedOptions) : undefined,
    };
  }

  clearAllSavedInfo() {
    localStorage.removeItem('selectedModel');
    localStorage.removeItem('selectedColor');
    localStorage.removeItem('options');
    this.selectedModel.next(null);
    this.selectedColor.next(null);
  }
}
