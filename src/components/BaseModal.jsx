import { Modal } from 'antd';
const useState = React.useState;

export const useModal = () => {
    const [visibale, setVisibale] = useState(!false);
    const toggle = () => setVisibale(!visibale);
    const CustomModal = ({ onOK, ...rest }) => (
        <Modal
            {...rest}
            visible={visibale}
            onOk={() => {
                onOK && onOK();
                toggle();
            }}
            onCancel={toggle}
        />
    );
    return {
        visibale,
        toggle,
        CustomModal
    };
};
