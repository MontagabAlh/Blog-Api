export type Article = {
  userId: number;
  id: number;
  title: string;
  description: string;
}

export type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export type PostArticle = Omit<Article, 'userId' | 'id'>;

export type UpdatePostArticle = Partial<Pick<Article, 'title' | 'description'>>;

export type RegisterUser = {
  username: string,
  email: string,
  password: string
}
export type CreateUser = {
  username: string,
  email: string,
  password: string,
  isAdmin: boolean
}
export type LoginUser = {
  username?: string,
  email?: string,
  password: string
}

export type OTPCheckoutUser = {
  email: string,
  otpCode: string
}

export type UpdateUser = {
  isAdmin: boolean
}

export type UpdateUserEmail = {
  email: string,
  otpCode: string
}

export type UpdateUserPassword = {
  currentPassword: string,
  newPassword: string,
}

export type JWTPayload = {
  id: number,
  isAdmin: boolean,
  username: string
}