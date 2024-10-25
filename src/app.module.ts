import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [ 
    // Load the .env file and make ConfigModule global (accessible in all modules)
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally across all modules
    }),

    // Use MongooseModule.forRootAsync to load connection string from environment variables
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DB_USERNAME')}:${configService.get('DB_PASSWORD')}@blog-test-assigment.n9g4n.mongodb.net/?retryWrites=true&w=majority&appName=blog-test-assigment`,
      }),
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service],
})

export class AppModule {}
