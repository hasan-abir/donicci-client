import {AnimationResolver} from '@gluestack-style/animation-resolver';
import {MotionAnimationDriver} from '@gluestack-style/legend-motion-animation-driver';
import {createConfig} from '@gluestack-style/react';
import {config as defaultConfig, componentsConfig} from '@gluestack-ui/config';
// import * as componentsTheme from './theme';

export const gluestackUIConfig = createConfig({
  aliases: {
    ...defaultConfig.aliases,
  } as const,
  tokens: {
    colors: {
      ...defaultConfig.tokens.colors,
      primary0: '#E5F1FB',
      primary50: '#CCE9FF',
      primary100: '#E7E6F9',
      primary200: '#7CC2FF',
      primary300: '#4AA9FF',
      primary400: '#1A91FF',
      primary500: '#0077E6',
      primary600: '#005DB4',
      primary700: '#8583E2',
      primary800: '#002851',
      primary900: '#011838',
      primary950: '#000711',
      secondary0: '#F6F6F6',
      secondary50: '#F3F3F3',
      secondary100: '#E7E6F9',
      secondary200: '#DADADA',
      secondary300: '#B0B0B0',
      secondary400: '#737373',
      secondary500: '#5F5F5F',
      secondary600: '#525252',
      secondary700: '#94DC96',
      secondary800: '#262626',
      secondary900: '#171717',
      secondary950: '#0C0C0C',
    },
    space: {
      ...defaultConfig.tokens.space,
    },
    borderWidths: {
      ...defaultConfig.tokens.borderWidths,
    },
    radii: {
      ...defaultConfig.tokens.radii,
    },
    breakpoints: {
      ...defaultConfig.tokens.breakpoints,
    },
    mediaQueries: {
      ...defaultConfig.tokens.mediaQueries,
    },
    letterSpacings: {
      ...defaultConfig.tokens.letterSpacings,
    },
    lineHeights: {
      ...defaultConfig.tokens.lineHeights,
    },
    fontWeights: {
      ...defaultConfig.tokens.fontWeights,
    },
    fonts: {
      heading: 'NotoSans-Bold',
      body: 'NotoSans-Regular',
      subheading: 'NotoSans-SemiBold',
      mono: 'monospace',
    },
    fontSizes: {
      ...defaultConfig.tokens.fontSizes,
    },
    opacity: {
      ...defaultConfig.tokens.opacity,
    },
  } as const,
  globalStyle: {
    variants: {
      ...defaultConfig.globalStyle.variants,
    },
  },
  plugins: [new AnimationResolver(MotionAnimationDriver)],
});

type Config = typeof gluestackUIConfig; // Assuming `config` is defined elsewhere

type Components = typeof componentsConfig;

export type {UIConfig, UIComponents} from '@gluestack-ui/themed';

export interface IConfig {}
export interface IComponents {}

declare module '@gluestack-ui/themed' {
  interface UIConfig extends Omit<Config, keyof IConfig>, IConfig {}
  interface UIComponents
    extends Omit<Components, keyof IComponents>,
      IComponents {}
}

export const config = {
  ...gluestackUIConfig,
  components: componentsConfig,
};
