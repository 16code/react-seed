export const menuData = [
    {
        name: 'Application',
        path: '/',
        children: [
            {
                name: 'Dashboard',
                path: 'dashboard'
            },
            {
                name: 'NotFound',
                path: '404',
                hidden: true
            }
        ]
    },
    {
        name: 'Music',
        path: 'music',
        children: [
            {
                name: '每日推荐',
                path: 'recommend'
            },
            {
                name: '排行榜',
                path: 'top'
            }
        ]
    },
    {
        name: 'Artist',
        path: 'artist',
        children: [
            {
                name: '推荐歌手',
                path: 'recommend'
            },
            {
                name: '全部歌手',
                path: 'all'
            }
        ]
    },
    {
        name: 'PlayList',
        path: 'playList',
        children: [
            {
                name: '精品歌单',
                path: 'hot'
            }
        ]
    }
];
/* eslint-disable-next-line */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

function isUrl(path) {
    return reg.test(path);
}
function formatter(data, parentPath, parentAuthRole) {
    return data.map(item => {
        let { path } = item;
        if (!isUrl(path)) {
            path = parentPath ? parentPath + item.path : item.path;
        }
        const result = {
            ...item,
            path: path.replace(/\/$/, ''),
            authRole: item.role || parentAuthRole
        };
        if (item.children) {
            const parent = item.path === '/' ? '/' : `/${item.path}/`;
            result.children = formatter(item.children, parent, item.role);
        }
        return result;
    });
}
export const getMenuData = () => formatter(menuData);
