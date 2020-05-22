import Joi from "@hapi/joi";
import { IUser } from "../../models/User";

export const signUpValidation = (data: IUser) => {
  const userSchema = Joi.object({
    username: Joi.string().min(4).max(30).required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    gender: Joi.string().required(),
    employeeNumber: Joi.string().required(),
    role: Joi.string().required(),
  });
  return userSchema.validate(data);
};

export const signInValidation = (data: IUser) => {
  const userSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return userSchema.validate(data);
};
