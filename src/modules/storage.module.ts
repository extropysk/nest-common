import { DynamicModule, Module, Type } from '@nestjs/common'

export const STORAGE_CONFIG = 'storage_config'

export interface StorageConfig {
  collectionName?: string
}

export abstract class IStorageService {
  abstract set<T>(key: string, value: T, exp?: number): Promise<void>
  abstract get<T>(key: string): Promise<T | null>
  abstract del(key: string): Promise<number>
}

interface Config {
  useClass: Type<IStorageService>
  config?: StorageConfig
}

interface AsyncConfig {
  useClass: Type<IStorageService>
  useFactory: (...args: unknown[]) => StorageConfig | Promise<StorageConfig>
  inject?: any[]
  imports?: any[]
}

@Module({})
export class StorageModule {
  static forRoot(options: Config): DynamicModule {
    return {
      module: StorageModule,
      global: true,
      providers: [
        {
          provide: STORAGE_CONFIG,
          useValue: options.config ?? {},
        },
        {
          provide: IStorageService,
          useClass: options.useClass,
        },
      ],
      exports: [IStorageService, STORAGE_CONFIG],
    }
  }

  static forRootAsync(options: AsyncConfig): DynamicModule {
    return {
      module: StorageModule,
      global: true,
      imports: options?.imports || [],
      providers: [
        {
          provide: STORAGE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        {
          provide: IStorageService,
          useClass: options.useClass,
        },
      ],
      exports: [IStorageService, STORAGE_CONFIG],
    }
  }
}
