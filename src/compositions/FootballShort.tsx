import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont as loadHeadlineFont} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadBodyFont} from '@remotion/google-fonts/Inter';
import type {ShortProps} from '../types';

const {fontFamily: headlineFont} = loadHeadlineFont('normal', {
  weights: ['400'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});
const {fontFamily: bodyFont} = loadBodyFont('normal', {
  weights: ['600', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

const activeCaption = (captions: ShortProps['captions'], timeMs: number) =>
  captions.find((caption) => timeMs >= caption.startMs && timeMs < caption.endMs) ??
  captions[captions.length - 1];

export const FootballShort: React.FC<ShortProps> = ({
  title,
  sourceName,
  images,
  captions,
  narrationSrc,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const timeMs = (frame / fps) * 1000;
  const caption = activeCaption(captions, timeMs);
  const imageCount = Math.max(images.length, 1);
  const imageIndex = Math.min(
    imageCount - 1,
    Math.floor((frame / durationInFrames) * imageCount),
  );
  const imageSrc = images[imageIndex] ?? images[0];
  const framesPerImage = durationInFrames / imageCount;
  const localFrame = frame - imageIndex * framesPerImage;
  const kenBurns = interpolate(localFrame, [0, framesPerImage], [1, 1.14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const introOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#04140c', fontFamily: bodyFont}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        {imageSrc ? (
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${kenBurns})`,
            }}
          />
        ) : null}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(4,20,12,0.55) 0%, rgba(4,20,12,0.15) 38%, rgba(4,20,12,0.82) 100%)',
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 48,
          right: 48,
          opacity: introOpacity,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#d4af37',
            color: '#04140c',
            fontWeight: 800,
            letterSpacing: 1.6,
            fontSize: 22,
            padding: '8px 14px',
            borderRadius: 6,
            textTransform: 'uppercase',
          }}
        >
          Football Shorts
        </div>
        <h1
          style={{
            fontFamily: headlineFont,
            color: 'white',
            fontSize: 86,
            lineHeight: 0.92,
            margin: '28px 0 0',
            textShadow: '0 8px 24px rgba(0,0,0,0.45)',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.82)',
            fontSize: 28,
            marginTop: 18,
          }}
        >
          {sourceName}
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 48,
          right: 48,
          bottom: 120,
          backgroundColor: 'rgba(4, 20, 12, 0.72)',
          borderLeft: '8px solid #d4af37',
          borderRadius: 18,
          padding: '28px 32px',
        }}
      >
        <p
          style={{
            color: 'white',
            fontSize: 42,
            lineHeight: 1.25,
            margin: 0,
            fontWeight: 650,
          }}
        >
          {caption?.text}
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 14,
          backgroundColor: 'rgba(255,255,255,0.18)',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: '#d4af37',
          }}
        />
      </div>

      <Audio src={staticFile(narrationSrc)} />
    </AbsoluteFill>
  );
};
