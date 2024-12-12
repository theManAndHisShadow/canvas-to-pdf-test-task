type EventStorage = {
    [key: string]: Array<(data: any) => void>;
}