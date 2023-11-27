import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('redirect')
export class RedirectController {

    @Redirect("autopilotapp://redirect", 301)
    @Get()
    redirect() {
        return "Redirect to app"
    }
}
