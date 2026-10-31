import { ImageResponse } from 'next/og';
import { ShapeIcon } from '~/atoms/ShapeIcon';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const AppleIcon = () =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1d2bd6',
        color: '#ffd23f',
      }}
    >
      <ShapeIcon slug="cone" size={140} />
    </div>,
    size,
  );

export default AppleIcon;
