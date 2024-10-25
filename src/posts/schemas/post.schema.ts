import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  content: string;

  @Prop()
  imageUrl: string;
}

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,  
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

export { PostSchema }
