import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  address: string;
}
