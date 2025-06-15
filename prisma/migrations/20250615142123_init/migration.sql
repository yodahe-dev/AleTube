-- CreateTable
CREATE TABLE `TeamMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `ig` VARCHAR(191) NOT NULL,
    `tiktok` VARCHAR(191) NOT NULL,
    `isFounder` BOOLEAN NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `accentColor` VARCHAR(191) NOT NULL,
    `flag` VARCHAR(191) NOT NULL,
    `specialties` VARCHAR(191) NOT NULL,
    `episodeCount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
