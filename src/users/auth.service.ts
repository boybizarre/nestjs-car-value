import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    // see if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email is in use');
    }

    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the salt aad the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // create new user and save it
    const user = await this.usersService.create(email, result);

    // return the user
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('No user was found with this email')
    }

    const [ salt, storedHash ] = user.password.split('.')

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      console.log('wrong user password')
      throw new BadRequestException('Wrong password')
    }

    return user;
  }
}
