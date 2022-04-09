export interface Video {
    Url: string,
    Description: string,
    MsSeconds: number | null
}

export interface BotConfig {
    Videos: Video[]
}