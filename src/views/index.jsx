import { Switch, Redirect, withRouter } from 'react-router-dom';
import routes, { renderRoutes } from './routes.config';

const Suspense = React.Suspense;

@withErrorBoundary
@withRouter
export default class Pages extends React.PureComponent {
    componentDidMount() {        
        this.onRouteChanged();
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.onRouteChanged();
        }
    }
    onRouteChanged() {
        console.log('ROUTE CHANGED', this.props.location.pathname);
    }
    render() {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Redirect from="/" to="/dashboard" exact />
                    {renderRoutes(routes)}
                </Switch>
            </Suspense>
        );
    }
}
