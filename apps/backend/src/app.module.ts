import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  ClerkAuthGuard,
  ClerkSdkTokenVerifier,
  CLERK_TOKEN_VERIFIER,
} from './guards/clerk-auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: CLERK_TOKEN_VERIFIER,
      useClass: ClerkSdkTokenVerifier,
    },
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
