import { Injectable } from '@nestjs/common';
import { version } from '../package.json';

@Injectable()
export class AppService {
  getHello(): Record<string, string> {
    return {
      message: 'Welcome to eigen test API!',
      version,
    };
  }
}
