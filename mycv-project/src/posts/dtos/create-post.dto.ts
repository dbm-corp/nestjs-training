import { IsDate, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsString()
  content: string;
}