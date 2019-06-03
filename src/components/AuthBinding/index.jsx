import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import Steper from './Steper';
import SteperAction from './SteperAction';
import { StepOne, StepTwo, StepThree } from './StepContent';

import styles from './styles.less';

const steps = ['下载应用', '输入口令', '完成绑定'];
export default class AuthBinding extends React.PureComponent {
    static propTypes = {
        userData: PropTypes.shape({
            account: PropTypes.string.isRequired,
            password: PropTypes.string.isRequired
        }),
        onBind: PropTypes.func.isRequired
    };
    state = {
        current: 0
    };
    formRef = React.createRef();
    static getDerivedStateFromProps(props, state) {
        const { visible } = props;
        if (state.visible !== visible) {
            return {
                visible: visible,
                current: visible ? 0 : state.current
            };
        }
        return null;
    }
    handleDone = () => {
        this.props.onOk && this.props.onOk();
    };
    handleCurrentChange = async action => {
        const { current } = this.state;
        const nextStep = action === 'prev' ? current - 1 : current + 1;
        if (nextStep === 2) {
            const { validateFields } = this.formRef.current;
            validateFields(async (err, values) => {
                if (!err) {
                    this.setState({ submiting: true });
                    const data = await this.props.onBind(values).finally(() => {
                        this.setState({ submiting: false });
                    });
                    if (data) {
                        this.setState({ current: nextStep });
                    }
                }
            });
            return;
        }
        this.setState({ current: nextStep });
    };
    get renderSteperContent() {
        const { current } = this.state;
        const userData = this.props.userData;
        return current === 0 ? (
            <StepOne className={styles['step-one']} />
        ) : current === 1 ? (
            <StepTwo data={userData} className={styles['step-two']} ref={this.formRef} />
        ) : (
            <StepThree className={styles['step-three']} />
        );
    }
    render() {
        const { visible, getContainer } = this.props;
        const { current, submiting } = this.state;
        let offsetHeight;
        let offsetWidth;
        if (getContainer) {
            offsetHeight = getContainer.offsetHeight;
            offsetWidth = getContainer.offsetWidth;
        }
        return (
            <Drawer
                className={styles['auth-binding-drawer']}
                placement="top"
                height={offsetHeight}
                width={offsetWidth}
                closable={false}
                visible={visible}
                getContainer={getContainer}
                maskClosable={false}
                mask={false}
            >
                <section className={styles['steper-wrapper']}>
                    <div className={styles['steper-header']}>
                        <Steper steps={steps} current={current} />
                    </div>
                    <div className={styles['steper-body']}>{this.renderSteperContent}</div>
                    <div className={classNames(styles['steper-action'], 'text-center')}>
                        <SteperAction
                            current={current}
                            stepsCount={steps.length}
                            onChange={this.handleCurrentChange}
                            loading={submiting}
                            onNext={() => this.handleCurrentChange('next')}
                            onPrev={() => this.handleCurrentChange('prev')}
                            onDone={this.handleDone}
                        />
                    </div>
                </section>
            </Drawer>
        );
    }
}
