export interface Video {
    Url: string,
    MsSeconds: number | null
}

export interface BotConfig {
    Videos: Video[]
}