import * as jwt from 'jsonwebtoken';

const SECRET = 'secret';

const sign = (payload: any) => {
  return jwt.sign(payload, SECRET);
}

const verify = (token: string) => {
  return jwt.verify(token, SECRET);
}

export default {
  sign,
  verify,
}