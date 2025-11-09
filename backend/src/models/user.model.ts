import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export type User = {
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
};

class UserModel {
  private users: User[] = [];

  constructor() {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const id = uuidv4();
    const hashed = user.password;
    const newUser: User = { id, ...user, password: hashed };
    this.users.push(newUser);
    return newUser;
  }

  async login(username: string, plainPassword: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (!user) return null;
    const match = await bcrypt.compare(plainPassword, user.password);
    return match ? user : null;
  }

  async seedUser(
    username: string,
    plainPassword: string,
    firstname = "Test",
    lastname = "User"
  ) {
    const hashed = await bcrypt.hash(plainPassword, 10);
    return this.create({ username, password: hashed, firstname, lastname });
  }

  getAll() {
    return this.users;
  }
}

export default new UserModel();
