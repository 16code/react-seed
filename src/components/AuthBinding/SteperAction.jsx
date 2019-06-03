import { Button } from 'antd';

export default ({ current = 0, stepsCount, loading, onNext, onPrev, onDone, ...rest }) => {
    const total = stepsCount - 1;
    return (
        <span {...rest}>
            {current === 0 && (
                <Button disabled={loading} onClick={onDone}>
                    取消绑定
                </Button>
            )}
            {current > 0 && current !== total && (
                <Button disabled={loading} onClick={onPrev}>
                    上一步
                </Button>
            )}
            {current < total && (
                <Button type="primary" onClick={onNext} loading={loading}>
                    {current === 0 && '下一步, 输入动态口令'}
                    {current === 1 && '下一步, 完成绑定'}
                </Button>
            )}
            {current === total && (
                <Button type="primary" onClick={onDone}>
                    完成绑定
                </Button>
            )}
        </span>
    );
};
