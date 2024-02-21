import { IsNotEmpty } from "class-validator";

export default class RegisterDTO {
  
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  description: string;
}
