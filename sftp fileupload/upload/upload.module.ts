import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { PrismaModule } from 'module/prisma/prisma.module';
import { CloudinaryService } from './cloudinary.service';

@Module({
    imports: [
        // MulterModule.register({
        //     dest: './uploads',
        //     limits: {
        //         fileSize: 10 * 1024 * 1024,
        //     },
        // }),
        // PrismaModule,
    ],
    controllers: [],
    providers: [CloudinaryService],
})
export class UploadModule {}
