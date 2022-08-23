import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'Pheng',
      password: 'not-secure'
    },
    {
      id: 2,
      username: 'Eduardo',
      password: 'not-secure'
    }
  ]

  create(createUserInput: CreateUserInput) {
    const user: User = {
      ...createUserInput,
      id: this.users.length + 1
    }
    this.users.push(user);
    console.log(this.users);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(username: string) {
    return this.users.find(user => user.username === username);
  }
}
