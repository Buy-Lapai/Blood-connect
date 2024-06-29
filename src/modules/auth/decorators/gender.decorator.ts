import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'bloodType', async: false })
export class GenderValidator implements ValidatorConstraintInterface {
  validate(gender: string, args: ValidationArguments) {
    const validGenderTypes = ['male', 'female'];
    if (!validGenderTypes.includes(gender.toLocaleLowerCase())) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Gender must be one of male or female';
  }
}

export function IsValidGender(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: GenderValidator,
    });
  };
}
