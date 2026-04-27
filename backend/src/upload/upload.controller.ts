import {
  Controller, Post, UploadedFile, UseInterceptors,
  BadRequestException, PayloadTooLargeException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

@Controller('upload')
export class UploadController {
  constructor(private readonly cfg: ConfigService) {
    cloudinary.config({
      cloud_name: cfg.get('CLOUDINARY_CLOUD_NAME'),
      api_key:    cfg.get('CLOUDINARY_API_KEY'),
      api_secret: cfg.get('CLOUDINARY_API_SECRET'),
    })
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo')
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('Solo se permiten imágenes')
    if (file.size > 5 * 1024 * 1024) throw new PayloadTooLargeException('Máximo 5MB')

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'adherneo/products', transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }] },
        (err, result) => err ? reject(err) : resolve(result!.secure_url),
      )
      Readable.from(file.buffer).pipe(stream)
    })

    return { url }
  }
}
