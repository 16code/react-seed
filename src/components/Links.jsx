import { Link } from 'react-router-dom';

export function SingerLink({ data = [], className }) {
    data = (Array.isArray(data) ? data : [data]).slice(0, 2);
    return data.map((item, index) => (
        <Link className={classNames(className)} key={index} to={`/singer/${item.id}`}>
            {item.name}
        </Link>
    ));
}
