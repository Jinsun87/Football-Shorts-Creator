import {Composition, staticFile, type CalculateMetadataFunction} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {FootballShort} from './compositions/FootballShort';
import {SAMPLE_SHORT_PROPS, type ShortProps} from './types';

const FPS = 30;

const calculateMetadata: CalculateMetadataFunction<ShortProps> = async ({
  props,
}) => {
  const audioSeconds = await getAudioDurationInSeconds(
    staticFile(props.narrationSrc),
  );
  const durationInFrames = Math.max(FPS * 8, Math.ceil(audioSeconds * FPS) + 12);

  return {
    durationInFrames,
    fps: FPS,
    width: 1080,
    height: 1920,
    props,
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="FootballShort"
      component={FootballShort}
      durationInFrames={360}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={SAMPLE_SHORT_PROPS}
      calculateMetadata={calculateMetadata}
    />
  );
};
