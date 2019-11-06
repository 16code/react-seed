import { Route } from 'react-router-dom';
const dashboard = React.lazy(() => import('./Dashboard'));
const Recommend = React.lazy(() => import('./Music/Recommend'));
const Search = React.lazy(() => import('./Music/Search'));
const routes = [
    {
        key: 'dashboard',
        exact: true,
        strict: false,
        path: '/dashboard',
        component: dashboard
    },
    {
        key: 'music',
        exact: true,
        strict: false,
        path: '/music/recommend',
        component: Recommend
    },
    {
        key: 'search',
        exact: true,
        strict: false,
        path: '/music/new',
        component: Search
    }
];

export function renderRoutes(routes, parentPath = '/', extraProps = {}) {
    return routes
        ? routes.map((route, i) =>
            Array.isArray(route.children) ? (
                renderRoutes(route.children, route.path)
            ) : (
                <Route
                    key={route.key || i}
                    path={`${parentPath}${route.path}`.replace(/\/\//g, '/')}
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
