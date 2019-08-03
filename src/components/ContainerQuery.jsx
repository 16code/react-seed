import { ContainerQuery as Query } from 'react-container-query';
const query = {
    'screen-xs': {
        maxWidth: 575
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199
    },
    'screen-xl': {
        minWidth: 1200
    }
};
export default function ContainerQuery({ children }) {
    return (
        <Query query={query}>
            {params =>
                React.Children.map(
                    children,
                    child =>
                        React.isValidElement(child) &&
                        React.cloneElement(child, {
                            className: classNames(params, child.props.className)
                        })
                )
            }
        </Query>
    );
}
ContainerQuery.displayName = 'ContainerQuery';
