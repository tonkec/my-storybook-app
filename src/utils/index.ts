export const DEFAULT_URL = 'https://jsonplaceholder.typicode.com/todos';
export const DEFAULT_METHOD = 'GET';

export interface FetchResult {
    data: Array<{
        userId: number;
        id: number;
        title: string;
        completed: boolean;
    }>;
    error: {};
    status: number | null;
}

export const callFetch = async ({
    method = DEFAULT_METHOD,
    url = DEFAULT_URL,
    body,
}: {
    method?: "GET";
    url: string
    body?: {}
}): Promise<FetchResult> => {
    let data = null;
    let error = null;
    let status = null;

    try {
        const response = await fetch(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            body: body ? JSON.stringify(body) : undefined,
        });
        const responseData = await response.json();
        if (response.ok) {
            data = responseData;
        } else {
            error = responseData;
        }
        status = response.status;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        error = err;
    }
    return {
        data,
        error,
        status,
    };
};