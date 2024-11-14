import { IsNumber, IsPhoneNumber, IsString, IsUrl, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize, IsBoolean } from 'class-validator';
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
    phone?: string;

    @IsOptional()
    @IsUrl()
    profileImg?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    years_experience?: number;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    services?: string[];

    @IsOptional()
    categories?: string[];

    @IsOptional()
    @IsBoolean()
    availability?: boolean;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @Type(() => String)
    @IsUrl({}, { each: true })
    portfolio_gallery?: string[];
}
