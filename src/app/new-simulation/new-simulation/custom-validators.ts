import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static initialInfectedLessThanPopulation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const populationSize = control.get('populationSize')?.value;
      const initialInfectedCount = control.get('initialInfectedCount')?.value;
      return initialInfectedCount < populationSize ? null : { initialInfectedInvalid: true };
    };
  }

  static reproductionRateTimesInfectedLessThanPopulation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const populationSize = control.get('populationSize')?.value;
      const initialInfectedCount = control.get('initialInfectedCount')?.value;
      const reproductionRate = control.get('reproductionRate')?.value;
      return (reproductionRate * initialInfectedCount) < populationSize ? null : { reproductionRateInvalid: true };
    };
  }
}
