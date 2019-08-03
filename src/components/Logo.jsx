import logo from '@/asstes/logo.svg';
export default function Logo({ src, title, className, ...rest }) {
    return (
        <a href="javascipt:;" className={className}>
            <img src={src || logo} alt={title} {...rest} />
            {title && <h1>{title}</h1>}
        </a>
    );
}
