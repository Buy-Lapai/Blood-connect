import { IsString } from "class-validator";

export class BloodBankDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  contactNumber: string;
}