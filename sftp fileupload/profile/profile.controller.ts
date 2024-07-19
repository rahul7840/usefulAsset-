import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update.dto';
import { AddProfileDto } from './dto/add.dto';
import { JwtAuthGuard } from 'module/auth/guards/jwt-auth.guard';
import { ApiError } from '@common/helper/error_description';
import { FileInterceptor } from '@nestjs/platform-express';
import { checkEmail } from './dto/email.dto';
import { fileFilter, sftpStorage } from 'config/smtp.config';

@Controller('user')
@ApiTags('User-Profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Patch('profile')
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    // @UseInterceptors(FileInterceptor('profile_img'))
    @UseInterceptors(
        FileInterceptor('profile_img', {
            storage: sftpStorage,
            fileFilter: fileFilter,
        }),
    )
    @ApiResponse({
        status: HttpStatus.OK,
        description: ApiError.SUCCESS_MESSAGE,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: ApiError.UNAUTHORIZED_MESSAGE,
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ApiError.BAD_REQUEST,
    })
    @ApiOperation({
        summary: 'Update profile',
        description: 'Update profile optionally with a new profile image',
    })
    async updateMe(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: AddProfileDto,
        @Request() req,
    ) {
        const id = req.user.id;
        let filePath = '';

        if (file) {
            filePath = file.originalname;
        }
        return await this.profileService.updateProfile(dto, id, filePath);
    }
}
