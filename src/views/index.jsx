import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
const Suspense = React.Suspense;
const About = React.lazy(() => import('./About'));
const Checkout = React.lazy(() => import('./Checkout'));
const Dashboard = React.lazy(() => import('./Dashboard'));

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
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/checkout" component={Checkout} />
                    <Route path="/about" component={About} />
                </Switch>
            </Suspense>
        );
    }
}
