import { Route } from 'react-router-dom';
const dashboard = React.lazy(() => import('./Dashboard'));
const routes = [
    {
        key: 'dashboard',
        exact: true,
        strict: false,
        path: '/dashboard',
        component: dashboard
    }
];

export function renderRoutes(routes, extraProps = {}) {
    return routes
        ? routes.map((route, i) => (
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
        ))
        : null;
}

export default routes;
