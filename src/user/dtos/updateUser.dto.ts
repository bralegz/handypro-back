import { IsNumber, IsPhoneNumber, IsString, IsUrl, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

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

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @Type(() => String)
    @IsUrl({}, { each: true })
    portfolio_gallery?: string[];
}
