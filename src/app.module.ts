import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { PersonaModule } from './persona/persona.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RubricsModule } from './rubrics/rubrics.module';
import { GlossaryModule } from './glossary/glossary.module';
import { QuickRoleplayModule } from './quick-roleplay/quick-roleplay.module';
import { AdvanceRoleplayModule } from './advance-roleplay/advance-roleplay.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    PersonaModule,
    RubricsModule,
    GlossaryModule,
    QuickRoleplayModule,
    AdvanceRoleplayModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
