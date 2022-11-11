import { AuthService } from 'src/services/authService';

export const authService = new AuthService();

export const main = async (event, context) => {
  let data;
  try {
    data = await authService.authenticate(event);
  } catch (err) {
    console.log(err);
    return context.fail('Unauthorized');
  }
  return data;
};
