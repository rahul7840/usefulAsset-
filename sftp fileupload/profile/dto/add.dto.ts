import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDate,
    IsNotEmpty,
    IsString,
    IsEnum,
    IsOptional,
} from 'class-validator';

enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
}

export class AddProfileDto {
    @ApiProperty({
        description: 'Enter the name',
        example: 'rahul',
        required: false,
    })
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Enter the birth date of the user',
        example: '2024-01-01',
        required: false,
    })
    @IsOptional()
    birth_date!: Date;

    @ApiProperty({
        description: 'Enter the height of the user in centimeters',
        example: '180',
        required: false,
    })
    @IsOptional()
    height?: string;

    @ApiProperty({
        description: 'Enter the weight of the user in kilograms',
        example: '75',
        required: false,
    })
    @IsOptional()
    weight?: string;

    @ApiPropertyOptional({
        description: 'List of preferred fitness represented by UUIDs',
        example: ['2684f683-65a6-40c4-a9af-49274d833111'],
        required: false,
    })
    @IsString({ each: true })
    fitnessGoal_id: string[];

    @ApiProperty({
        description: 'Enter the gender of the user',
        example: 'Male',
        required: false,
        enum: Gender,
    })
    @IsOptional()
    @IsEnum(Gender, { message: 'Gender must be one of: Male, Female, Other' })
    gender?: string;

    @ApiProperty({
        description: 'List of preferred fitness represented by UUIDs',
        example: ['2684f683-65a6-40c4-2222-49274d834444'],
        required: false,
    })
    @IsString({ each: true })
    activityLevel_id: string[];

    @ApiProperty({
        description: 'Enter new image',
        format: 'binary',
        required: false,
    })
    @IsOptional()
    profile_img?: string;
}
