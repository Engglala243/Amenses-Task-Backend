import * as AuthService from "../services/auth.service.js";
import createError from "http-errors";

export async function postSignup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await AuthService.signup({ name, email, password });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      throw createError(401, 'User not authenticated');
    }
    return res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
}
