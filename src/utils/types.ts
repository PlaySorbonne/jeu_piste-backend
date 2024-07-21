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
  LocalsType & { loggedUserId: string; sessionId: string; isAdmin: boolean }
>;

export type RequestWPrisma<
  BodyType = any,
  ParamsType extends Record<string, any> = Record<string, any>,
  QueryType extends Record<string, any> = Record<string, any>
> = Request<ParamsType, any, BodyType, QueryType> & { prisma?: PrismaClient };
