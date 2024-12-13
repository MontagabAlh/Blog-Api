export type Article = {
  userId: number;
  id: number;
  title: string;
  subtitle: string;
  metaDescription: string;
  image: string;
  description: string;
  categoryId: number;
}

export type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export type PostArticle = {
  title: string;
  subtitle: string;
  metaDescription: string;
  image: string;
  description: string;
  categoryId: number;
};

export type PostCategory = {
  id: number,
  name: string,
  subname: string,
  metaDescription: string,
};

export type UpdatePostArticle = {
  title?: string;
  subtitle?: string;
  metaDescription?: string;
  image?: string;
  description?: string;
  categoryId?: number;
}

export type UpdatePostCategory = {
  name?: string;
  subname?: string;
  metaDescription?: string;
}

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