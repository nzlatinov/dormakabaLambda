export interface IEvent {
    queryStringParameters: {
        bucket?: string,
        key?: string
    }
}

export interface IResponse {
    statusCode: number,
    body: string
}