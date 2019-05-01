import '@styles';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '@components/Login';
import AppProvider from './AppProvider';
import BaiscLayout from './BaiscLayout';

export default class AppContainer extends React.PureComponent {
    render() {
        return (
            <AppProvider>
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" component={Login} exact />
                        <Route path="/" component={BaiscLayout} />
                    </Switch>
                </BrowserRouter>
            </AppProvider>
        );
    }
}
