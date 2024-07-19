import { emailRegExp } from '@common/types/reg.exp.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class checkEmail {
    @ApiProperty({
        description: 'Enter the email',
        example: 'testuser@example.com',
        required: true,
    })
    @IsEmail()
    @Matches(emailRegExp, {
        message: "'Email' must be a valid E-Mail Format.",
    })
    email: string;
}
