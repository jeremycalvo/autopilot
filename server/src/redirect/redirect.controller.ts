import { Controller, Get, Redirect, Res } from '@nestjs/common';

@Controller('redirect')
export class RedirectController {

    @Get()
    redirect(@Res() res) {
        return res.redirect(302, "autopilotapp://redirect/code/1234")
    }
}
