export default function Checkout() {
    return (
        <div>
            checkout
            <Test ccc="hahah" />
        </div>
    );
}

@withErrorBoundary
@safeSetState
@displayName('Test')
class Test extends React.PureComponent {
    componentDidMount() {
        setTimeout(() => {
            this.setState({ foo: 'bar1111' });
        }, 3000);
    }
    @autobind
    handleClick() {
        console.info('clicked');
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick}>Test {this.state.foo}</button>
            </div>
        );
    }
}
