import { Controller, Get, Post, Param, Body, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post as BlogPost } from './schemas/post.schema';
import { S3Service } from 'src/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly s3Service: S3Service
  ) {}

  @Get()
  async findAll(): Promise<BlogPost[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogPost> {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))  // Handle the file upload
  async create(
    @UploadedFile() file: Express.Multer.File, // Extract the uploaded file
    @Body() createPostDto: CreatePostDto       // Extract the form data
  ) {
    if (!file) {
      throw new Error('No file found');
    }

    try {
      const imageUrl = await this.s3Service.uploadFile(file.buffer, file.mimetype, file.originalname);
      const postToCreate = {
        ...createPostDto, // Title, description, content
        imageUrl,         // Add the imageUrl after upload
      };
  
      
      return this.postsService.create(postToCreate); // Save the post to the database

    } catch (error) {
      console.log(error);
    }
  }


  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<BlogPost> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BlogPost> {
    return this.postsService.delete(id);
  }
}
