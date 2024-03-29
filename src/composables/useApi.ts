import useRequest from './helpers/useRequest';
import useResponse from './helpers/useResponse';
import { TRequestValues, TRequestConstructor } from "@/types/api";

export default (requestConstructor: TRequestConstructor, requestValues: TRequestValues = {}):
    Promise<{ status: string; isSuccess: boolean; data: any; errors: object; } | any> | any => {
    let response: any;
    let valuesKeys:string[] = requestValues ? Object.keys(requestValues) : [];

    // Shortcut for POST : If no 'params','query','body' keys in requestValues object, so it is 'body' object itself.
    if (valuesKeys.length && !valuesKeys.some((key: any) => ['path', 'params', 'query', 'body'].includes(key))) {
        const body = { ...requestValues };
        requestValues = {};
        requestValues.body = body;
    }

    const request = useRequest(requestConstructor, requestValues);
    console.log('►►►', request.method.toUpperCase(), request.path, requestConstructor, requestValues);

    if (request)
        response = useResponse({ method: request.method, path: request.path, exec: request.exec });
    else throw new Error('Something went wront with your API request.');
    return response;
};
