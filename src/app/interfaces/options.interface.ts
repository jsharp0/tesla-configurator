import { Config } from './config.interface';

export interface Options {
  configs: Config[];
  towHitch: boolean;
  yoke: boolean;
}

export interface SavedOptions {
  config: Config;
  canHaveTowHitch: boolean;
  canHaveYoke: boolean;
  includeTowHitch?: boolean;
  includeYoke?: boolean;
}
