import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ name: 'bloodType', async: false })
export class ObjectIdValidator implements ValidatorConstraintInterface {
  validate(id: string, args: ValidationArguments) {
    if (!mongoose.isValidObjectId(id)) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid object ID';
  }
}

export function IsValidObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ObjectIdValidator,
    });
  };
}
