import { ApiProperty } from '@nestjs/swagger';
import {
    IsDate,
    IsNotEmpty,
    IsString,
    IsEnum,
    IsOptional,
} from 'class-validator';

enum FitnessGoal {
    WEIGHT_LOSS = 'Weight Loss',
    MUSCLE_GAIN = 'Muscle Gain',
    MAINTENANCE = 'Maintenance',
}

enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
}

enum ActivityLevel {
    SEDENTARY = 'Sedentary',
    LIGHT = 'Light',
    MODERATE = 'Moderate',
    ACTIVE = 'Active',
    VERY_ACTIVE = 'Very Active',
}

export class UpdateProfileDto {
    @ApiProperty({
        description: 'Enter the birth date of the user',
        example: '1990-01-01',
        required: true,
    })
    @IsOptional()
    birth_date?: string;

    @ApiProperty({
        description: 'Enter the height of the user in centimeters',
        example: '180',
        required: true,
    })
    @IsOptional()
    height?: string;

    @ApiProperty({
        description: 'Enter the weight of the user in kilograms',
        example: '75',
        required: true,
    })
    @IsOptional()
    weight?: string;

    @ApiProperty({
        description: 'Enter the fitness goal of the user',
        example: 'Weight Loss',
        required: true,
        enum: FitnessGoal,
    })
    @IsEnum(FitnessGoal, {
        message:
            'Fitness goal must be one of: Weight Loss, Muscle Gain, Maintenance',
    })
    @IsOptional()
    fitnessGoal?: string;

    @ApiProperty({
        description: 'Enter the gender of the user',
        example: 'Male',
        required: true,
        enum: Gender,
    })
    @IsEnum(Gender, { message: 'Gender must be one of: Male, Female, Other' })
    @IsOptional()
    gender?: string;

    @ApiProperty({
        description: 'Enter the activity level of the user',
        example: 'Moderate',
        required: true,
        enum: ActivityLevel,
    })
    @IsEnum(ActivityLevel, {
        message:
            'Activity level must be one of: Sedentary, Light, Moderate, Active, Very Active',
    })
    @IsOptional()
    activityLevel?: string;
}
