import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service.js';
import { UserDao } from './dao/user.dao.js';
import { Bcrypt } from '../../common/utils/bcrypt.js';
import { Password } from '../../common/utils/password.js';
import { ConfigService } from '../../config/config.service.js';
import { UserRoles } from '../../common/enums/domain.enums.js';

class FakeUserDao {
  private users: any[] = [];
  private counter = 0;
  async findByEmail(email: string) { return this.users.find((u) => u.email === email); }
  async findById(id: string) { return this.users.find((u) => u.id === id); }
  async findAll() { return [...this.users]; }
  async create(data: any) {
    const u = { ...data, id: String(++this.counter), createdAt: new Date(), updatedAt: new Date() };
    this.users.push(u);
    return u;
  }
  async update(id: string, data: any) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...data };
    return this.users[idx];
  }
  clear() { this.users = []; this.counter = 0; }
}

describe('UserService', () => {
  let service: UserService;
  let dao: FakeUserDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserDao, useClass: FakeUserDao },
        Bcrypt,
        Password,
        ConfigService,
      ],
    }).compile();

    service = module.get(UserService);
    dao = module.get(UserDao) as any;
    dao.clear();
  });

  it('crea un usuario nuevo', async () => {
    const user = await service.create('a@b.com', 'Abcdef1!xyz', [UserRoles.TECHNICIAN]);
    expect(user.email).toBe('a@b.com');
    expect((user as any).passwordHash).toBeUndefined();
  });

  it('lanza ConflictException si el email ya existe', async () => {
    await service.create('a@b.com', 'Abcdef1!xyz', [UserRoles.TECHNICIAN]);
    await expect(service.create('a@b.com', 'Abcdef1!xyz', [UserRoles.TECHNICIAN])).rejects.toThrow();
  });

  it('findById devuelve undefined para id inexistente', async () => {
    expect(await service.findById('nope')).toBeUndefined();
  });
});
