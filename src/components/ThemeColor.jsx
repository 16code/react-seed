import { Icon } from 'antd';
const styles = {
    colorBlock: {
        float: 'left',
        margin: 4,
        width: 20,
        height: 20,
        borderRadius: 2,
        textAlign: 'center',
        color: '#fff'
    }
};
const colorList = [
    {
        key: 'dust',
        color: '#F5222D'
    },
    {
        key: 'volcano',
        color: '#FA541C'
    },
    {
        key: 'sunset',
        color: '#FAAD14'
    },
    {
        key: 'cyan',
        color: '#13C2C2'
    },
    {
        key: 'green',
        color: '#52C41A'
    },
    {
        key: 'daybreak',
        color: '#1890FF'
    },
    {
        key: 'geekblue',
        color: '#2F54EB'
    },
    {
        key: 'purple',
        color: '#722ED1'
    }
];
const Tag = ({ color, checked, ...rest }) => (
    <div
        {...rest}
        style={{
            ...styles.colorBlock,
            backgroundColor: color
        }}
    >
        {checked ? <Icon type="check" /> : ''}
    </div>
);
export default function ThemeColor(props) {
    return (
        <div>
            {colorList.map(({ key, color }) => (
                <Tag
                    checked
                    key={key}
                    color={color}
                    onClick={() => {
                        props.onClick(color);
                    }}
                />
            ))}
        </div>
    );
}
