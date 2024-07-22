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

const nameSchema = z.custom<string>((val) => {
  return typeof val === "string" && val.length > 3 && val.length < 20 // allows string of length 4
    ? /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]+$/.test(val) // regex for alphanumeric and _- (allows _- only if there is at least one alphanumeric character)
    : false;
});

export const schemas = {
  name: nameSchema,
  displayName: nameSchema,
  mail: z.string().email(),
  password: z.string().min(5),
  score: z.union([
    z.number().int().positive(),
    z.string().regex(/^[0-9]+$/).transform((val) => parseInt(val)),
  ])
} as const;

// En milliseconde, -1 = infinie
export const sessionTTL = -1;
