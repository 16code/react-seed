interface IFrequest {
    (
        url: string,
        options?: {
        baseURL?: string;
        headers?: Object;
        params?: Object;
        body?: Object;
        responseType: 'json' | 'text' | 'blob' | 'arraybuffer' | 'document';
        onUploadProgress: (progressEvent: any) => void;
        onDownloadProgress: (progressEvent: any) => void;
        validateStatus: (status: any) => boolean;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        }
    ): void;
    setHeader(headers: Object): void;
}

declare const request: IFrequest;
