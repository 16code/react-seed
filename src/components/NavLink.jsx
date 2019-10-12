import { NavLink } from 'react-router-dom';

export default function CustomNavLink(props) {
    console.log(props);
    
    return <NavLink {...props} />;
}
