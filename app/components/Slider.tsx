
export default function Slider(props: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const { label, min, max, step, value, onChange, disabled } = props;

    return (
        <div>
        <div className="flex items-center justify-between text-xs text-zinc-700">
            <span>{label}</span>
            <span>{value.toFixed(2)}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className="w-full"
        />
        </div>
    );
};
