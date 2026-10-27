import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service.js';
import { UserDao } from './dao/user.dao.js';
import { Bcrypt } from '../../common/utils/bcrypt.js';
import { Password } from '../../common/utils/password.js';
import { ConfigService } from '../../config/config.service.js';
import { UserRoles } from '../../common/enums/domain.enums.js';

describe('UserService', () => {
  let service: UserService;
  let dao: UserDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserDao,
        Bcrypt,
        Password,
        ConfigService,
      ],
    }).compile();

    service = module.get(UserService);
    dao = module.get(UserDao);
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
