type TQueryProperty = {
    required: boolean | null;
    default?: string;
    format?: any;
    validators?: Function[];
}

type TContructorQuery = {
    [key: string]: TQueryProperty;
}

type TConfigBuilder = {
    headers?: Record<string, string>;
}

export type TRequestValues = {
    path?: string;
    params?: any;
    query?: any;
    body?: any;
    config?: TConfigBuilder;
}

export type TRequestConstructor = {
    api: any;
    method: string;
    path: string;
    query: TContructorQuery;
    params?: any;
    body?: any;
    config?: TConfigBuilder;
}

export type TResponseData = {
    status?: number;
    isSuccess?: boolean;
    data?: any;
    errors?: any;
}



