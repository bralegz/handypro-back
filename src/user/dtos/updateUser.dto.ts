import { IsNumber, IsPhoneNumber, IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateUserDto {
    
    @IsOptional()
    @IsString()
    fullname?: string;
    
    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsUrl()
    profileImg?: string;

    @IsOptional()
    @IsNumber()
    years_experience?: number;

    @IsOptional()
    services?: string[];

    @IsOptional()
    categories?: string[];
}
