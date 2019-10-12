
import { Route } from 'react-router-dom';

const about = React.lazy(() => import('./About'));
const checkout = React.lazy(() => import('./Checkout'));
const dashboard = React.lazy(() => import(/* webpackChunkName: "dashboard" */ './Dashboard'));
const table = React.lazy(() => import('./Table'));

const routes = [
    {
        key: 'dashboard',
        exact: true,
        strict: false,
        path: '/dashboard',
        component: dashboard
    },
    {
        path: '/checkout',
        component: checkout
    },
    {
        path: '/about',
        component: about
    },
    {
        path: '/table',
        component: table
    }
];

export function renderRoutes(routes, extraProps = {}) {
    return routes ? routes.map((route, i) => (
        <Route
            key={route.key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={props =>
                route.render ? (
                    route.render({ ...props, ...extraProps, route })
                ) : (
                    <route.component {...props} {...extraProps} route={route} />
                )
            }
        />
    )) : null;
}

export default routes;
