const useState = React.useState;
const useEffect = React.useEffect;

export const useRequest = (requestUrl, initRequestConfig, initialData) => {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [requestConfig, setRequestConfig] = useState(initRequestConfig);
    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);
            try {
                const result = await request(requestUrl, { ...requestConfig });
                setData(result);
            } catch (error) {
                console.log(error);
                setIsError(true);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [requestUrl, requestConfig]);
    return [{ data, isLoading, isError }, setRequestConfig];
};

export const withRequest = (theRequest, theHandles) => WrappedComponent => props => {
    let apiUrl;
    let config;
    let initData;
    let handles;
    if (typeof theRequest === 'function') {
        const configs = theRequest(props);
        initData = configs.initialData;
        apiUrl = configs.url;
        config = configs.requestConfig;
    }
    const [{ data, isLoading, isError }, setRequestConfig] = useRequest(apiUrl, config, initData);
    if (typeof theHandles === 'function') {
        handles = theHandles(setRequestConfig);
    }
    return <WrappedComponent {...props} {...handles} data={data} isLoading={isLoading} isError={isError} />;
};
