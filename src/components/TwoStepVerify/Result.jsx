import { Icon } from 'antd';
export default function Result({ className, state = 'waiting' }) {
    const ICON_ENUM = {
        waiting: {
            className: 'icon icon-loading',
            type: 'loading',
            spin: true,
            stuff: '正在等待结果, 请稍后...',
            tips: '感谢您使用二次绑定, 二次绑定能有效放置帐号被盗风险!'
        },
        succeed: {
            className: 'icon icon-succeed',
            theme: 'filled',
            type: 'check-circle',
            stuff: '动态口令绑定成功',
            tips: '以后登录都需要输入Google动态口令哦，手机千万不要丢失！'
        },
        filed: {
            className: 'icon icon-filed',
            theme: 'filled',
            type: 'close-circle',
            stuff: '动态口令绑定失败',
            tips: 'Sorry 动态口令绑定失败了, 请点击重新绑定!'
        }
    };
    return (
        <div className={className}>
            <Icon {...ICON_ENUM[state]} />
            <h2 className="subtitle">{ICON_ENUM[state].stuff}</h2>
            <span className="tips">{ICON_ENUM[state].tips}</span>
        </div>
    );
}
