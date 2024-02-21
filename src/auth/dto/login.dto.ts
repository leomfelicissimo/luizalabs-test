import { IsNotEmpty } from "class-validator";

export default class LoginDTO {
  
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  password: string;
}
