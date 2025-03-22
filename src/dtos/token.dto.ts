import { IpLocationDto } from 'src/dtos/ipLocation.dto';
export class TokenCreateDto {
  value: string;
  ip: string;
  location?: IpLocationDto;
  type?: string;
}
