import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';

@Controller('image')
export class ImagesController {

    @Get(':filename')
    @ApiOperation({summary: 'Get service\'s image by filename'})
    serveImage(@Param('filename') filename: string, @Res() res: Response) {
        const imagePath = join(__dirname, '..', '..', 'images', filename);
        return res.sendFile(imagePath)
    }
}
