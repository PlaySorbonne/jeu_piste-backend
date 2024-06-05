import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export interface OKApiResponse<T> {
  message: string;
  status: number;
  data: T;
  isError: false;
}
export interface ErrorApiResponse {
  message: string;
  status: number;
  data?: any;
  isError: true;
}

export type ApiResponse<T> = OKApiResponse<T> | ErrorApiResponse;

export type ResponseTyped<
  T = any,
  U extends Record<string, any> = Record<string, any>,
> = Response<ApiResponse<T>, U>;

export type ResponseTypedWAuth<
  T = any,
  U extends Record<string, any> = Record<string, any>,
> = ResponseTyped<T, U & { loggedUserId: string; sessionId: string }>;

export type RequestWPrisma<BodyType = any, QueryType = any> = Request<
  any, // HACK any
  any,
  BodyType,
  QueryType
> & { prisma?: PrismaClient };
