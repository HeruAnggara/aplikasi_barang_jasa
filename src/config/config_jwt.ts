import * as crypto  from 'crypto';

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  };

export const jwt_config = {
    // secret: 'abcdefghij',
    secret: generateRandomString(32),
    expired: 3600
  };