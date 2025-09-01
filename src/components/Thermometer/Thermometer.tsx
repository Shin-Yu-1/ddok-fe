type ThermometerProps = {
  temperature: number; // 0~100
  color?: string; // 채움색
  stroke?: string; // 외곽선색
  width?: number; // SVG width
  height?: number; // SVG height
  animated?: boolean; // 애니메이션
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(v, b));
const Thermometer = ({
  temperature,
  stroke = '#525252',
  width = 20,
  height = 21,
  animated = true,
}: ThermometerProps) => {
  const t = clamp(temperature, 0, 100);
  const level = t / 100;

  const STEM_X = 8;
  const STEM_Y = 3.5;
  const STEM_W = 4;
  const STEM_H = 11;

  const BULB_CX = 10;
  const BULB_CY = 17;
  const BULB_R = 3.5;

  const stemFillH = STEM_H * level;
  const stemFillY = STEM_Y + (STEM_H - stemFillH);

  let color: string;
  switch (true) {
    case temperature >= 33 && temperature < 66:
      color = '#fbbf24'; // yellow
      break;
    case temperature >= 66:
      color = '#dc2626';
      break; // red
    default:
      color = '#3b82f6'; // blue
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 21"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${t}°C thermometer`}
    >
      {/* 1) 벌브는 항상 채움 */}
      <circle cx={BULB_CX} cy={BULB_CY} r={BULB_R} fill={color} />

      {/* 2) 줄기는 퍼센트만큼 채움 (클립 불필요: 줄기 영역 내에서만 그리기) */}
      {stemFillH > 0 && (
        <rect
          x={STEM_X}
          y={stemFillY}
          width={STEM_W}
          height={stemFillH}
          rx={2}
          fill={color}
          style={animated ? { transition: 'y .25s ease, height .25s ease' } : undefined}
        />
      )}

      {/* 3) 외곽선은 '단일 path'로만 그리기 → 중간 라인 없음 */}
      <path
        d="M11.666 4.14765V12.931C12.3015 13.2979 12.7981 13.8642 13.0789 14.5421C13.3598 15.2201 13.409 15.9717 13.2191 16.6805C13.0292 17.3892 12.6107 18.0156 12.0286 18.4622C11.4464 18.9089 10.7331 19.1511 9.99935 19.1511C9.26557 19.1511 8.55229 18.9089 7.97015 18.4622C7.388 18.0156 6.96951 17.3892 6.7796 16.6805C6.58968 15.9717 6.63895 15.2201 6.91975 14.5421C7.20056 13.8642 7.69721 13.2979 8.33268 12.931V4.14765C8.33268 3.70563 8.50828 3.2817 8.82084 2.96914C9.1334 2.65658 9.55732 2.48099 9.99935 2.48099C10.4414 2.48099 10.8653 2.65658 11.1779 2.96914C11.4904 3.2817 11.666 3.70563 11.666 4.14765Z"
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default Thermometer;
