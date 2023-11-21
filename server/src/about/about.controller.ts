import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('about.json')
export class AboutController {
    constructor() {}

    @Get()
    @ApiOperation({summary: 'Gives the information about all the services and their AREA'})
    getAbout(@Req() req: Request) {
        let ip = req.ip
        if (ip.startsWith('::ffff:')) {
            ip = ip.substring(7)
        }
        const about = {
            client: {
                host: ip,
            },
            server: {
                current_time: Date.now(),
                services: [
                    {
                        name: "Spotify",
                        actions: [
                            {
                                name: "Song change",
                                description: "Triggered when the playing song changes",
                            }
                        ],
                        reactions: [
                            {
                                name: "Skip song",
                                description: "Skips the current song",
                            }
                        ]
                    },
                    {
                        name: "Discord",
                        actions: [
                            {
                                name: "Message received",
                                description: "Triggered when a specific message is received in a specific channel",
                            },
                            {
                                name: "Message containing string received",
                                description: "Triggered when a message containing a string is received in a specific channel",
                            },
                            {
                                name: "Message from author received",
                                description: "Triggered when a message from a specific author is received in a specific channel",
                            }
                        ],
                        reactions: [
                            {
                                name: "Send message",
                                description: "Sends a message to a specific channel",
                            }
                        ]
                    },
                    {
                        name: "Gmail",
                        actions: [
                            {
                                name: "New email",
                                description: "Triggered when a new email is received",
                            },
                            {
                                name: "New email from address",
                                description: "Triggered when a new email is received from a specific address",
                            },
                            {
                                name: "New mail with subject",
                                description: "Triggered when a new email is received with a specific subject",
                            }
                        ],
                        reactions: [
                            {
                                name: "Send email",
                                description: "Sends an email to a specific address",
                            }
                        ]
                    },
                    {
                        name: "Github",
                        actions: [
                            {
                                name: "New commit",
                                description: "Triggered when a new commit is made to a specific repository",
                            }
                        ],
                        reactions: [
                            {
                                name: "Create issue",
                                description: "Creates an issue in a specific repository",
                            }
                        ]
                    },
                    {
                        name: "Google Sheets",
                        actions: [],
                        reactions: [
                            {
                                name: "Write to last row",
                                description: "Writes to the last row of a specific column",
                            }
                        ]
                    }
                ]
            }
        }
        return about
    }
}

