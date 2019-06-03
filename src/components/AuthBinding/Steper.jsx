import { Steps } from 'antd';

const Step = Steps.Step;

export default ({ steps, current = 0 }) => {
    return (
        <Steps size="default" current={current}>
            {steps.map(s => (
                <Step key={s} title={s} />
            ))}
        </Steps>
    );
};
