export const INTEGRATIONS = [
    {
        name: 'Spotify',
        code: 'spotify',
        link: 'https://accounts.spotify.com/authorize?scope=user-read-private%20user-read-email%20user-read-currently-playing%20user-modify-playback-state%20user-read-playback-state&access_type=offline&response_type=code&redirect_uri=http%3A%2F%2F128.199.149.52%3A8080%2Fredirector%3Fservice%3Dspotify&client_id=1ded278c7bd3445b8fdac4ba37af42de',
        triggers: [
            {
                name: 'Song changed',
                description: 'Triggered when a song changes',
                code: 'MUSIC_CHANGE',
                params: [],
                returnValues: ["music", "artist", "id"]
            },
            {
                name: 'New song in playlist',
                description: 'Triggered when a new song is added to a playlist',
                code: 'NEW_MUSIC_PLAYLIST',
                params: ["Playlist ID"],
                returnValues: ["music", "artist", "id"]
            }
        ],
        reactions: [
            {
                name: 'Skip song',
                description: 'Skips the current song - PREMIUM USERS ONLY',
                code: 'SKIP_MUSIC',
                params: []
            }
        ],
    },
    {
        name: 'Discord',
        code: 'discord',
        link: 'https://discord.com/api/oauth2/authorize?client_id=1067011256403370044&permissions=2048&response_type=code&redirect_uri=http%3A%2F%2F128.199.149.52%3A8080%2Fredirector%3Fservice%3Ddiscord&scope=identify+bot',
        triggers: [
            {
                name: 'Message received',
                description: 'Triggered when a specific message is received in a specific channel',
                code: 'NEW_MESSAGE',
                params: ["Channel ID", "Content"],
                returnValues: ["content", "author", "id"]
            },
            {
                name: 'Message containing string received',
                description: 'Triggered when a message containing a string is received in a specific channel',
                code: 'NEW_MESSAGE_CONTAINING',
                params: ["Channel ID", "String to find"],
                returnValues: ["content", "author", "id"]
            },
            {
                name: 'Message from author received',
                description: 'Triggered when a message from a specific author is received in a specific channel',
                code: 'NEW_MESSAGE_FROM',
                params: ["Channel ID", "Author name"],
                returnValues: ["content", "author", "id"]
            },
        ],
        reactions: [
            {
                name: 'Send message',
                description: 'Sends a message to a specific channel',
                code: 'SEND_MESSAGE',
                params: ["Channel ID", "Message"]
            }
        ]
    },
    {
        name: 'Gmail',
        code: 'gmail',
        link: 'https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fmail.google.com%2F%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=http://localhost:8081/services&client_id=816277643788-07kn2qqkvr18sfp80637fl9qivoek2k7.apps.googleusercontent.com',
        triggers: [
            {
                name: 'New mail',
                description: 'Triggered when a new mail is received',
                code: 'NEW_MAIL',
                params: [],
                returnValues: ["id", "content", "address", "subject"]
            },
            {
                name: 'New mail from address',
                description: 'Triggered when a new mail is received from a specific address',
                code: 'NEW_MAIL_FROM',
                params: ["Mail adress"],
                returnValues: ["id", "content", "address", "subject"]
            },
            {
                name: 'New mail with subject',
                description: 'Triggered when a new mail is received with a specific subject',
                code: 'NEW_MAIL_WITH_SUBJECT',
                params: ["Subject"],
                returnValues: ["id", "content", "address", "subject"]
            }
        ],
        reactions: [
            {
                name: 'Send mail',
                description: 'Sends an email to a specific address',
                code: 'SEND_MAIL',
                params: ["Mail adress", "Subject", "Content"]
            }
        ],
    },
    {
        name: 'Github',
        code: 'github',
        link: 'https://github.com/login/oauth/authorize?client_id=65bc43b86cebb7071f2f&redirect_uri=http%3A%2F%2F128.199.149.52%3A8080%2Fredirector%3Fservice%3Dgithub&scope=repo',
        triggers: [
            {
                name: "New commit",
                description: "Triggered when a new commit is detected in a repo",
                code: "NEW_COMMIT",
                params: ["Organization", "Repository name"],
                returnValues: ["sha", "author", "commit_message", "url"]
            },
        ],
        reactions: [
            {
                name: "Create issue",
                description: "Creates an issue in a repository",
                code: "CREATE_ISSUE",
                params: ["Organization", "Repository name", "Title", "Body", "Labels (separated by commas)", "Assignees (separated by commas)"],
            },
        ],
    },
    {
        name: 'Sheets',
        code: 'sheets',
        link: 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=http://localhost:8081/services&client_id=816277643788-07kn2qqkvr18sfp80637fl9qivoek2k7.apps.googleusercontent.com',
        triggers: [],
        reactions: [
            {
                name: "Write to last row",
                description: "Writes a value to the last row of a column",
                code: "WRITE_TO_LAST_ROW",
                params: ["Spreadsheet ID", "Column name (format A:A)", "Values (separated by commas)"]
            },
            {
                name: "Write to cell",
                description: "Writes a value to a specific cell",
                code: "WRITE_TO_CELL",
                params: ["Spreadsheet ID", "Cell name (format A1)", "Value"]
            }
        ],
    }
]