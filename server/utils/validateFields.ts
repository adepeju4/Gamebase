interface SignupFields {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface LoginFields {
  userName: string;
  password: string;
}

type Fields = SignupFields | LoginFields;
type Mode = 'signup' | 'login';

const validateFields = (mode: Mode, fields: Fields): string[] => {
  const output: string[] = [];
  !fields.userName && output.push('No username provided');
  !fields.password && output.push('No password provided');
  if (mode === 'signup') {
    const signupFields = fields as SignupFields;
    !signupFields.lastName && output.push('No last name provided');
    !signupFields.firstName && output.push('No firstName provided');
    !signupFields.email && output.push('No email provided');
  }
  return output;
};

export const createError = (err: unknown): { message: { err: unknown } } => {
  return { message: { err } };
};

export default validateFields;
