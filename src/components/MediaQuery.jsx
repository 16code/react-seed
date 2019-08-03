import { isMobileDevice } from '@helper';
import Media from 'react-media';
export default function MediaQuery(props) {
    const [isMobile, setIsMobile] = React.useState(isMobileDevice);
    return (
        <Media query={{ maxWidth: 767.99 }} onChange={setIsMobile}>
            {() => props.children(isMobile)}
        </Media>
    );
}
