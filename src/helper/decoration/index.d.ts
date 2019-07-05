/** 设置默认的props */
export function defaultProps(props: object): void
/** 设置初始化state */
export function initialState(props: object): void
/** 设置PropTypes */
export function propTypes(props: object): void
/** safety setState */
export function safeSetState(): void
/** 为 class 添加 property */
export function property(name: string, value: any): void
/** 为 class 添加 displayName 属性 */
export function displayName(name: string): void
/** log a method params */
export function log(): void
/** debounce 防抖 */
export function debounce(wait: number, immediate: boolean): void

/** throttle 节流 */
export function throttle(
    wait: number,
    options: {
        leading: boolean
        trailing: boolean
    }
): void
/** 阻止事件冒泡及默认行为 */
export function killEvent(): void
/** 阻止默认行为 */
export function preventDefault(): void
/** 阻止事件冒泡 */
export function stopPropagation(): void
/** autobind */
export function autobind(): void
/** inject a property */
export function inject(value: string): void
