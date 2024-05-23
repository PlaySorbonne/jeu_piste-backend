declare namespace Express {
  export interface Request {
    // HACK mettre un meilleur type
    prisma?: any
  }
}
