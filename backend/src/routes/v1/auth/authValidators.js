export const authPostValidator = {
  email: {
    errorMessage: 'Email should be a valid email address',
    isEmail: true,
  },
  password: {
    exists: true,
    errorMessage: 'Password is required',
  },
}