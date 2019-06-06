import { Steps, Button, Form } from 'antd';
import PropTypes from 'prop-types';
import AppDownload from './AppDownload';
import AuthBind from './AuthBind';
import Result from './Result';
import styles from './styles.less';
const Step = Steps.Step;

const steps = ['下载应用', '输入口令', '完成绑定'];
const ACTION_ENUM = {
    previous: {
        label: '上一步',
        behavior: 'onPrev'
    },
    next: {
        label: '下一步',
        btnType: 'primary',
        behavior: 'onNext'
    },
    done: {
        waiting: {
            label: '完成绑定',
            btnType: 'default',
            behavior: 'onDone'
        },
        succeed: {
            label: '完成绑定',
            btnType: 'primary',
            behavior: 'onDone'
        },
        filed: {
            label: '重新绑定',
            btnType: 'danger',
            behavior: 'onPrev'
        }
    },
    cancel: {
        label: '取消绑定',
        behavior: 'onCancel'
    }
};
const ACTIONS = {
    0: ['cancel', 'next'],
    1: ['previous', 'next'],
    2: ['done']
};

@Form.create()
export default class TwoStepVerify extends React.PureComponent {
    static propTypes = {
        state: PropTypes.string,
        onPrev: PropTypes.func,
        onCancel: PropTypes.func,
        onDone: PropTypes.func,
        onNext: PropTypes.func,
        userData: PropTypes.shape({
            qrcode: PropTypes.string,
            secretKey: PropTypes.string
        })
    };
    constructor() {
        super();
        this.state = { current: 0 };
    }
    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };
    onDone = () => {
        this.props.onDone && this.props.onDone();
    };
    onNext = () => {
        const nextCurrent = this.state.current + 1;
        if (nextCurrent === 2) {
            this.props.form.validateFields((err, values) => {
                if (err) return;
                this.triggerNext(nextCurrent, { current: nextCurrent, data: values });
            });
        } else {
            this.triggerNext(nextCurrent, { current: nextCurrent });
        }
    };
    onPrev = () => {
        const nextCurrent = this.state.current - 1;
        this.setState({ current: nextCurrent });
        this.props.onPrev && this.props.onPrev({ current: nextCurrent });
    };
    triggerNext = (nextCurrent, data) => {
        const { onNext } = this.props;
        this.setState({ current: nextCurrent }, () => {
            onNext && onNext(data);
        });
    };
    get stepContentRender() {
        const { current } = this.state;
        const { userData, form, state } = this.props;
        let content;
        switch (current) {
            case 0:
                content = <AppDownload className={styles['donwload-point']} />;
                break;
            case 1:
                content = <AuthBind userData={userData} form={form} />;
                break;
            case 2:
                content = <Result state={state} className={styles.result} />;
                break;
        }
        return content;
    }
    get stepsRender() {
        const { current } = this.state;
        return (
            <Steps current={current}>
                {steps.map(s => (
                    <Step key={s} title={s} />
                ))}
            </Steps>
        );
    }
    get stepActionRender() {
        const { current } = this.state;
        const { state } = this.props;
        ACTION_ENUM.next.label = `下一步, ${current === 0 ? '输入动态口令' : '完成绑定'}`;
        return ACTIONS[current].map(key => {
            const { btnType, label, behavior } = current !== 2 ? ACTION_ENUM[key] : ACTION_ENUM[key][state] || {};
            const onClick = this[behavior] ? this[behavior] : () => {};
            return (
                <Button key={key} type={btnType} onClick={onClick} disabled={state === 'waiting'}>
                    {label}
                </Button>
            );
        });
    }
    render() {
        return (
            <div className={styles['two-step-verify']}>
                <div className={styles.wrapper}>
                    {this.stepsRender}
                    <div className={styles['steps-content']}>{this.stepContentRender}</div>
                    <div className={styles['steps-action']}>{this.stepActionRender}</div>
                </div>
            </div>
        );
    }
}
