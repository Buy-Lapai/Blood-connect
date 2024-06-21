import { IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreateVisitDto {
    @IsString()
    @IsNotEmpty()
    donorId: string;

    @IsString()
    @IsNotEmpty()
    bloodBankId: string;

    @IsDate()
    @IsNotEmpty()
    visitDate: Date;
}