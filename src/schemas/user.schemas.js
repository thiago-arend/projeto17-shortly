import joi from "joi";

export const usersSignupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirmPassword: joi.string().min(6).required().valid(joi.ref('password'))
});

export const usersSigninSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});