export const usersPostValidator = {
  name: {
    isLength: {
      errorMessage: "Name should be at least 3 chars long",
      options: { min: 3, max: 50 },
      trim: true,
    },
  },
  email: {
    errorMessage: "Email should be a valid email address",
    isEmail: true,
  },
  password: {
    isLength: {
      errorMessage: "Please enter a password with 6 or more characters",
      options: { min: 6 },
    },
  },
};