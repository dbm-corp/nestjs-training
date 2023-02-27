import { IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsString()
  content: string;
}
