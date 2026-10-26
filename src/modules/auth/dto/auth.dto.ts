import { IsEmail, IsString, IsNumber, Min, Max } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  captchaToken: string;

  @IsNumber()
  @Min(0)
  @Max(99)
  captchaAnswer: number;
}

export class RefreshDto {
  @IsString()
  refreshToken: string;
}
