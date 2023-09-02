import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './app/auth/auth.module';
import { UsersModule } from '@app/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { CredentialsModule } from '@app/credentials/credentials.module';
import { NotesModule } from '@app/notes/notes.module';
import { CardsModule } from '@app/cards/cards.module';
import { WifisModule } from '@app/wifis/wifis.module';
import { LicensesModule } from '@app/licenses/licenses.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CredentialsModule,
    NotesModule,
    CardsModule,
    WifisModule,
    LicensesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
