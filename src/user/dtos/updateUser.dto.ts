import { IsNumber, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    fullname?: string;
    @IsString()
    location?: string;

    @IsString()
    @IsPhoneNumber()
    phone?: string;

    @IsUrl()
    profileImg?: string;

    @IsNumber()
    years_experience?: number;

    services?: string[];

    categories?: string[];
}
