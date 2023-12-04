import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { Request } from 'express';

@Controller('redirector')
export class RedirectController {

    @Get()
    redirect(@Req() req: Request, @Res() res) {
        console.log(req.query);
        return res.redirect(302, "autopilotapp://redirect?service=" + req.query.service + "&code=" + req.query.code)
    }
}
