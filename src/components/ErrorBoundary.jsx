const handleError = ctx => (
    <div className="error-boundary">
        <h2 className="error-title">Errors in &lt;{ctx.displayName}&nbsp; &frasl;&gt; Component</h2>
        <div className="error-description">{ctx.state.error && ctx.state.error.message}</div>
        <span className="line" />
        <details className="error-trace">
            <summary tabIndex="-1">{ctx.state.errorInfo.length} stack frames were collapsed</summary>
            <pre>
                {ctx.state.errorInfo.map((errItem, index) => (
                    <span key={index}>
                        <label>{index + 1} |</label>
                        {errItem}
                    </span>
                ))}
            </pre>
        </details>
    </div>
);

const catchFunc = (error, errorInfo, ctx) => {
    ctx.setState({
        error,
        errorInfo: errorInfo.componentStack
            .split('\n')
            .filter(t => t !== '')
            .map(t => t.replace(/^\s+/g, ''))
    });
};

export const withErrorBoundary = WrappedComponent =>
    class extends React.Component {
        constructor(props) {
            super(props);
            this.state = { error: null, errorInfo: null };
            this.displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
        }

        componentDidCatch = (error, errorInfo) => catchFunc(error, errorInfo, this);

        render() {
            if (this.state.errorInfo) return handleError(this);
            return <WrappedComponent {...this.props} />;
        }
    };

export default class ErrorBoundary extends React.PureComponent {
    state = {
        // eslint-disable-next-line react/no-unused-state
        error: null,
        errorInfo: null
    };
    componentDidCatch = (error, errorInfo) => catchFunc(error, errorInfo, this);
    render() {
        if (this.state.errorInfo) return handleError(this);
        return this.props.children;
    }
}
