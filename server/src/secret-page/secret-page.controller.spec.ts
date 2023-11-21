import { Test, TestingModule } from '@nestjs/testing';
import { SecretPageController } from './secret-page.controller';

describe('SecretPageController', () => {
  let controller: SecretPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretPageController],
    }).compile();

    controller = module.get<SecretPageController>(SecretPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
