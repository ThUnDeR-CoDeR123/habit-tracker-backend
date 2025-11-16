export const validateCreateHabit = (body: any) => {
  const errors: string[] = [];
  if (!body) {
    errors.push("Missing request body");
    return errors;
  }
  const { title, description, frequency } = body;
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("title is required and must be a non-empty string");
  }
  if (description && typeof description !== "string") {
    errors.push("description must be a string");
  }
  if (!frequency || (frequency !== "daily" && frequency !== "weekly")) {
    errors.push("frequency is required and must be 'daily' or 'weekly'");
  }
  return errors;
};

export const validateUpdateHabit = (body: any) => {
  const errors: string[] = [];
  if (!body) {
    errors.push("Missing request body");
    return errors;
  }
  const { title, description, frequency } = body;
  if (title !== undefined && (typeof title !== "string" || title.trim().length === 0)) {
    errors.push("title must be a non-empty string");
  }
  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string");
  }
  if (frequency !== undefined && frequency !== "daily" && frequency !== "weekly") {
    errors.push("frequency must be 'daily' or 'weekly'");
  }
  return errors;
};
