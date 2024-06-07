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
  LocalsBodyType extends Record<string, any> = Record<string, any>,
  DataResponseType = any,
  LocalsType extends Record<string, any> = Record<string, any>
> = Response<
  ApiResponse<DataResponseType>,
  LocalsType & { body: LocalsBodyType }
>;

export type ResponseTypedWAuth<
  LocalsBodyType extends Record<string, any> = Record<string, any>,
  DataResponseType = any,
  LocalsType extends Record<string, any> = Record<string, any>
> = ResponseTyped<
  LocalsBodyType,
  DataResponseType,
  LocalsType & { loggedUserId: string; sessionId: string }
>;

export type RequestWPrisma<BodyType = any, QueryType = any> = Request<
  any, // HACK any
  any,
  BodyType,
  QueryType
> & { prisma?: PrismaClient };
