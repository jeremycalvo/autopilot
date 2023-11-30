import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { Request } from 'express';

@Controller('redirector')
export class RedirectController {

    @Get()
    redirect(@Req() req: Request, @Res() res) {
        console.log(req.params);
        return res.redirect(302, "autopilotapp://redirect?code=1234")
    }
}
