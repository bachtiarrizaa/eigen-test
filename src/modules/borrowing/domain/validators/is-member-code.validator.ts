import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isMemberCode', async: false })
export class IsMemberCodeConstraint implements ValidatorConstraintInterface {
  validate(code: string, _args: ValidationArguments) {
    return typeof code === 'string' && code.startsWith('M');
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Member code must start with M';
  }
}

export function IsMemberCode(validationOptions?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMemberCodeConstraint,
    });
  };
}
