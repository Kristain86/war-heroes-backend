import { Request, Response } from 'express';
import { texts } from '../const/texts';
import { User } from '../index';

const handleErrors = (err: Error) => {
  const errors: { [key: string]: string } = { username: '', email: '', password: '' };

  if (err.code === 11000) {
    errors.email = texts.forms.errors.email.ALREADY_REGISTERED;
    return errors;
  }

  if (err.message.includes('User validation failed:')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const signUpGet = async (req: Request, res: Response) => {
  res.status(200).json({ hello: 'hello' });
};

const signUpPost = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
  }
};

const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.status(200).json({ email, password });
};

export { signUpGet, loginPost, signUpPost };
