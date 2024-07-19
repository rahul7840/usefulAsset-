import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'module/prisma/prisma.service';
import { AddProfileDto } from './dto/add.dto';
import { UpdateProfileDto } from './dto/update.dto';
import { NotFoundError } from 'rxjs';
import { CloudinaryService } from 'module/upload/cloudinary.service';
import { checkEmail } from './dto/email.dto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async updateProfile(dto: AddProfileDto, id: string, filePath: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const transaction = await this.prisma.$transaction(async (prisma) => {
            const existingProfile = await prisma.user.findUnique({
                where: { id },
            });

            if (!existingProfile) {
                throw new NotFoundException('User profile not found');
            }

            let imageUrl = existingProfile.profile_img;
            if (filePath) {
                imageUrl =
                    await this.cloudinaryService.uploadImageSMTP(filePath);
            }

            const updateData = {
                full_name: dto.name,
                birth_date: dto.birth_date
                    ? new Date(dto.birth_date)
                    : undefined,
                height: dto.height,
                weight: dto.weight,
                gender: dto.gender,
                profile_img: imageUrl,
            };

            Object.keys(updateData).forEach(
                (key) =>
                    updateData[key] === undefined && delete updateData[key],
            );

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
            });

            if (dto.fitnessGoal_id) {
                const fitnessGoals = this.processArrayInput(dto.fitnessGoal_id);
                await this.validateFitnessGoalsExistence(fitnessGoals);
                await this.updateFitnessGoals(id, fitnessGoals);
            }
            if (dto.activityLevel_id) {
                const activityLevel = this.processArrayInput(
                    dto.activityLevel_id,
                );
                await this.validateFitnessActivityExistence(activityLevel);
                await this.updateActivityLevel(id, activityLevel);
            }
            const checkAgain = await this.prisma.user.findFirst({
                where: {
                    id,
                },
                include: {
                    FitnessUser: {
                        include: {
                            fitness_goal: { select: { id: true, name: true } },
                        },
                    },

                    ActivityLevelUser: {
                        select: {
                            ActivityLevel: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            return {
                ...updatedUser,
                fitness_goal: checkAgain?.FitnessUser.map(
                    (item) => item.fitness_goal,
                ),
                activity_level: checkAgain?.ActivityLevelUser.map(
                    (item) => item.ActivityLevel,
                ),
            };
        });

        return transaction;
    }




    
    private processArrayInput(input: string[] | string): string[] {
        if (!input) {
            return [];
        }
        const arrayInput = Array.isArray(input) ? input : input.split(',');
        return arrayInput.filter((item) => item.trim() !== '');
    }

    private async validateFitnessGoalsExistence(fitnessGoals: string[]) {
        const existingFitnessGoals = await this.prisma.fitnessGoal.findMany({
            where: { id: { in: fitnessGoals } },
        });
        if (existingFitnessGoals.length !== fitnessGoals.length) {
            const missingFitnessGoals = fitnessGoals.filter(
                (goal) => !existingFitnessGoals.some((fg) => fg.id === goal),
            );
            throw new BadRequestException(
                `provided Goal ID (${missingFitnessGoals.join(', ')}) do not exist`,
            );
        }
    }
    private async validateFitnessActivityExistence(activityLevel: string[]) {
        const existingFitnessGoals = await this.prisma.activityLevel.findMany({
            where: { id: { in: activityLevel } },
        });
        if (existingFitnessGoals.length !== activityLevel.length) {
            const missingFitnessGoals = activityLevel.filter(
                (goal) => !existingFitnessGoals.some((fg) => fg.id === goal),
            );
            throw new BadRequestException(
                `provided Activity ID (${missingFitnessGoals.join(', ')}) do not exist`,
            );
        }
    }

    private async updateFitnessGoals(userId: string, fitnessGoals: string[]) {
        await this.prisma.fitnessUser.deleteMany({
            where: { user_id: userId },
        });
        await this.prisma.fitnessUser.createMany({
            data: fitnessGoals.map((fitnessId) => ({
                user_id: userId,
                fitness_id: fitnessId,
            })),
        });
    }

    private async updateActivityLevel(userId: string, activityLevel: string[]) {
        await this.prisma.activityLevelUser.deleteMany({
            where: { user_id: userId },
        });
        await this.prisma.activityLevelUser.createMany({
            data: activityLevel.map((fitnessId) => ({
                user_id: userId,
                activity_id: fitnessId,
            })),
        });
    }
}
