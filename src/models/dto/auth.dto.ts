export const validateRegister = (body: any) => {
  const errors: string[] = [];
  if (!body) {
    errors.push("Missing request body");
    return errors;
  }
  const { name, email, password } = body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("name is required and must be a non-empty string");
  }
  if (!email || typeof email !== "string") {
    errors.push("email is required and must be a string");
  } else {
    // simple email regex
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) errors.push("email must be a valid email address");
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("password is required and must be at least 6 characters");
  }

  return errors;
};

export const validateLogin = (body: any) => {
  const errors: string[] = [];
  if (!body) {
    errors.push("Missing request body");
    return errors;
  }
  const { email, password } = body;
  if (!email || typeof email !== "string") {
    errors.push("email is required and must be a string");
  }
  if (!password || typeof password !== "string") {
    errors.push("password is required and must be a string");
  }
  return errors;
};
