import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'bloodType', async: false })
export class BloodTypeValidator implements ValidatorConstraintInterface {
  validate(bloodType: string, args: ValidationArguments) {
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    if (!validBloodTypes.includes(bloodType)) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Blood type must be one of A+, A-, B+, B-, O+, O-, AB+, AB-';
  }
}

export function IsValidBloodType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: BloodTypeValidator,
    });
  };
}
