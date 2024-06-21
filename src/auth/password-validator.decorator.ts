import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customPassword', async: false })
export class CustomPasswordValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
      const patterns = [
          /[a-z]/,
          /[A-Z]/,
          /[0-9]/,
          /[!@#$%^&*]/,
      ];

      for (const pattern of patterns) {
          if (!pattern.test(password)) {
              return false;
          }
      }

      if (password.length < 8) {
          return false;
      }

      return true;
  }

  defaultMessage(args: ValidationArguments) {
      return 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long';
  }
}

export function IsVeryStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
      registerDecorator({
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          constraints: [],
          validator: CustomPasswordValidator,
      });
  };
}
