import s from './style.less';

export default function Switche({ onChange, ...props }) { 
    return (
        <label className={s.switche}>
            <input
                type="checkbox"
                {...props}
                onChange={event => {                              
                    onChange && onChange(event.target.checked);
                }}
            />
            <span className={s['checkbox-label']} />
        </label>
    );
}
