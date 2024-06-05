import { z } from "zod";

export enum HttpCodes {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401, // pas connecté
  FORBIDDEN = 403, // connecté mais pas suffisant
  NOT_FOUND = 404,
  WRONG_METHOD = 405,
  INTERNAL_ERROR = 500,
}

export const schemas = {
  name: z.string().min(5).max(20),
  mail: z.string().email(),
  password: z.string().min(5),
} as const;
