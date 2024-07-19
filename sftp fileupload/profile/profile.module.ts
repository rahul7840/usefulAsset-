import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from 'module/prisma/prisma.module';
import { CloudinaryService } from 'module/upload/cloudinary.service';

@Module({
    imports:[PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService, CloudinaryService]
})
export class ProfileModule {}
