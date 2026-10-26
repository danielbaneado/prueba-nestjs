import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { UserStore } from './user.store.js';
import { Bcrypt } from '../../common/utils/bcrypt.js';
import { Password } from '../../common/utils/password.js';
import { ConfigService } from '../../config/config.service.js';
import { UserRoles } from '../../common/enums/domain.enums.js';

describe('UsersService', () => {
  let service: UsersService;
  let store: UserStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserStore,
        Bcrypt,
        Password,
        ConfigService,
      ],
    }).compile();

    service = module.get(UsersService);
    store = module.get(UserStore);
    store.clear();
  });

  it('crea un usuario nuevo', async () => {
    const user = await service.create('a@b.com', 'Abcdef1!xyz', [UserRoles.USUARIO]);
    expect(user.email).toBe('a@b.com');
    expect((user as any).passwordHash).toBeUndefined();
  });

  it('lanza ConflictException si el email ya existe', async () => {
    await service.create('a@b.com', 'Abcdef1!xyz', [UserRoles.USUARIO]);
    await expect(service.create('a@b.com', 'Abcdef1!xyz', [UserRoles.USUARIO])).rejects.toThrow();
  });

  it('findById devuelve undefined para id inexistente', async () => {
    expect(await service.findById('nope')).toBeUndefined();
  });
});
