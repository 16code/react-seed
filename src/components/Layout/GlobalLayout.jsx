export default function BasicLayout({ className, children, aside, footer }) {
    return (
        <>
            <div className={classNames('layout-basic', className)}>
                <aside className="layout-aside">{aside}</aside>
                <section className="layout-content">{children}</section>
            </div>
            <footer className="layout-footer">{footer}</footer>
        </>
    );
}
