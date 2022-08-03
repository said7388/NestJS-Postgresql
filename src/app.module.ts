import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/typeorm.config';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [TypeOrmModule.forRoot(DatabaseConfig), StudentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
