import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfigService } from 'config/config.service';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fsPromises } from 'fs';
import { PrismaService } from 'module/prisma/prisma.service';

@Injectable()
export class CloudinaryService {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly prisma: PrismaService,
    ) {
        this.initializeCloudinary();
    }

    private initializeCloudinary() {
        cloudinary.config({
            cloud_name: this.appConfigService.cloudName,
            api_key: this.appConfigService.apiKey,
            api_secret: this.appConfigService.apiSecret,
        });
    }

    private async handleFileDeletion(filePath: string) {
        try {
            await fsPromises.unlink(filePath);
        } catch (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    }

    async deleteImageByUrl(imageUrl: string): Promise<void> {
        try {
            const publicId = this.extractPublicIdFromUrl(imageUrl);
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new BadRequestException('Failed to delete image.');
        }
    }

    private extractPublicIdFromUrl(imageUrl: string): string {
        const publicIdMatch = imageUrl.match(/\/v\d+\/(.+?)\./);
        if (publicIdMatch) {
            return publicIdMatch[1];
        }
        throw new BadRequestException('Invalid Cloudinary image URL format');
    }

    async uploadImages(filePaths: string[], userId: string) {
        const findUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!findUser) {
            throw new BadRequestException(` not found`);
        }

        const uploadPromises = filePaths.map(async (filePath) => {
            try {
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'uploads',
                });
                await this.handleFileDeletion(filePath);
                const imageUrl = result.secure_url || '';
                return imageUrl; // Return the image URL
            } catch (error) {
                console.error(`Error uploading file: ${filePath}`, error);
                return ''; // Return an empty string in case of error
            }
        });

        // Wait for all upload promises to resolve
        const uploadedUrls = await Promise.all(uploadPromises);

        return uploadedUrls;
    }

    async uploadImage(filePath: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'uploads',
            });
            await this.handleFileDeletion(filePath);
            return result.secure_url || '';
        } catch (error) {
            console.error(`Error uploading file: ${filePath}`, error);
            return '';
        }
    }

    async uploadImageSMTP(file: string) {
        // Construct the URL of the uploaded file
        try {
            const imageUrl = `https://thingslinker.com/upload_images/ring_images/${file}`;
            console.log('>>>>>>>>>', imageUrl);
            return imageUrl;
        } catch (error) {
            console.error(`Failed to upload file via SFTP: ${file}`, error);
            throw new Error(`Failed to upload file via SFTP: ${file}`);
        }
    }
}
