import { DynamicModule, Module, Type } from '@nestjs/common'

export abstract class IStorageService {
  abstract set<T>(key: string, value: T, exp?: string): Promise<void>
  abstract get<T>(key: string): Promise<T | null>
  abstract del(key: string): Promise<number>
}

interface Config {
  useClass: Type<IStorageService>
}

@Module({})
export class StorageModule {
  static forRoot(options: Config): DynamicModule {
    return {
      module: StorageModule,
      global: true,
      providers: [
        {
          provide: IStorageService,
          useClass: options.useClass,
        },
      ],
      exports: [IStorageService],
    }
  }
}
