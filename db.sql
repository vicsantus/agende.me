CREATE DATABASE IF NOT EXISTS `agende-me`;

USE `agende-me`;

CREATE TABLE `Users` (
    `id` CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `firstName` VARCHAR(255),
    `lastName` VARCHAR(255),
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT("user"),
    `isEmailVerified` BOOLEAN DEFAULT FALSE,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    `deletedAt` TIMESTAMP NULL
);

CREATE TABLE `tokens` (
    `id` CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `token` VARCHAR(500) NOT NULL,
    `user` CHAR(36) NOT NULL,
    `expires` DATETIME NOT NULL DEFAULT(
        DATE_ADD(
            CURRENT_TIMESTAMP,
            INTERVAL 20 MINUTE
        )
    ),
    `type` ENUM(
        'ACCESS',
        'REFRESH',
        'RESET_PASSWORD',
        'VERIFY_EMAIL'
    ) NOT NULL,
    `blacklisted` BOOLEAN DEFAULT FALSE,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP NULL,
    FOREIGN KEY (`user`) REFERENCES `Users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `Profiles` (
    `id` CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `user` CHAR(36) NOT NULL,
    `profile` VARCHAR(300) NOT NULL,
    `tags` VARCHAR(90) NOT NULL DEFAULT("[]"),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP NULL,
    FOREIGN KEY (`user`) REFERENCES `Users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `FreeSchedules` (
    `id` CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    `owner` CHAR(36) NOT NULL,
    `responsible` VARCHAR(36) NOT NULL,
    `year` YEAR NOT NULL,
    `mounth` TINYINT UNSIGNED NOT NULL,
    `day` TINYINT UNSIGNED NOT NULL,
    `hstart` TINYINT UNSIGNED NOT NULL,
    `mstart` TINYINT UNSIGNED NOT NULL,
    `hend` TINYINT UNSIGNED NOT NULL,
    `mend` TINYINT UNSIGNED NOT NULL,
    `comments` VARCHAR(300) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`owner`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`responsible`) REFERENCES `Users` (`id`) ON DELETE CASCADE
);