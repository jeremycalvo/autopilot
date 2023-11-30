import { Controller, Get, Redirect, Res } from '@nestjs/common';

@Controller('redirector')
export class RedirectController {

    @Get()
    redirect(@Res() res) {
        return res.redirect(302, "autopilotapp://zouzou?code=1234")
    }
}
