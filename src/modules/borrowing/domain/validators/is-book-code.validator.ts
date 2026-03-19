import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBookCode', async: false })
export class IsBookCodeConstraint implements ValidatorConstraintInterface {
  validate(code: string, _args: ValidationArguments): boolean {
    const regex = /^[A-Z0-9]+-[A-Z0-9]+$/i;
    return typeof code === 'string' && regex.test(code);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Book code must contain letters and numbers separated by -';
  }
}

export function IsBookCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBookCodeConstraint,
    });
  };
}
