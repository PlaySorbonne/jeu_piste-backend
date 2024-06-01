import { Request } from "express";
import { PrismaClient } from '@prisma/client'

export interface ResquestWPrisma extends Request {
    prisma?: PrismaClient
  }
