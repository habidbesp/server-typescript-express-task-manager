import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (
  enterPassword: string,
  storedHash: string
): Promise<boolean> => {
  return await bcrypt.compare(enterPassword, storedHash);
};
