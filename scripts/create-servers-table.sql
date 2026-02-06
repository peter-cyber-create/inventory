-- Create servers table for Host and Virtual Server management
-- Run this on your PostgreSQL database if the table doesn't exist

CREATE TABLE IF NOT EXISTS "servers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "serialNo" VARCHAR(255) NOT NULL,
    "engranvedNo" VARCHAR(255) NOT NULL,
    "serverName" VARCHAR(255) NOT NULL,
    "productNo" VARCHAR(255) NOT NULL,
    "IP" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(255) NOT NULL,
    "memory" VARCHAR(255) NOT NULL,
    "purchaseDate" VARCHAR(255) NOT NULL,
    "processor" VARCHAR(255) NOT NULL,
    "expiryDate" VARCHAR(255) NOT NULL,
    "hypervisor" VARCHAR(255) NOT NULL,
    "hardDisk" VARCHAR(255) NOT NULL,
    "warrantly" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Add index on serverName for faster searches
CREATE INDEX IF NOT EXISTS "idx_servers_serverName" ON "servers" ("serverName");

-- Add index on serialNo for faster lookups
CREATE INDEX IF NOT EXISTS "idx_servers_serialNo" ON "servers" ("serialNo");
