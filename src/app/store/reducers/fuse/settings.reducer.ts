import * as Actions from "app/store/actions/fuse";
import {
  defaultSettings,
  defaultThemeOptions,
  defaultThemes,
  extendThemeWithMixins,
  getParsedQuerySettings,
  mainThemeVariations,
  mustHaveThemeOptions,
} from "@fuse/FuseDefaultSettings";
import { createTheme } from "@material-ui/core/styles";
import FuseSettingsConfig from "app/fuse-configs/settingsConfig";
import FuseThemesConfig from "app/fuse-configs/themesConfig";
import FuseLayoutConfigs from "app/fuse-layouts/FuseLayoutConfigs";
import merge from "lodash/merge";

const initialSettings = getInitialSettings();
const initialThemes = getInitialThemes();

const initialState = {
  initial: initialSettings,
  defaults: merge({}, initialSettings),
  current: merge({}, initialSettings),
  themes: initialThemes,
  ...getThemeOptions(initialThemes, initialSettings),
};

const settings = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_SETTINGS: {
      const current = generateSettings(state.defaults, action.value);
      const themes =
        current.theme.main !== state.current.theme.main
          ? {
              ...state.themes,
              ...updateMainThemeVariations(current.theme.main),
            }
          : state.themes;
      return {
        ...state,
        current,
        themes,
        ...getThemeOptions(themes, current),
      };
    }
    case Actions.SET_INITIAL_SETTINGS: {
      return merge({}, initialState);
    }
    case Actions.SET_DEFAULT_SETTINGS: {
      const defaults = generateSettings(state.defaults, action.value);
      const themes =
        defaults.theme.main !== state.defaults.theme.main
          ? {
              ...state.themes,
              ...updateMainThemeVariations(defaults.theme.main),
            }
          : state.themes;
      return {
        ...state,
        defaults: merge({}, defaults),
        current: merge({}, defaults),
        themes,
        ...getThemeOptions(themes, defaults),
      };
    }
    case Actions.RESET_DEFAULT_SETTINGS: {
      const themes = {
        ...state.themes,
        ...updateMainThemeVariations(state.defaults.theme.main),
      };
      return {
        ...state,
        defaults: merge({}, state.defaults),
        current: merge({}, state.defaults),
        themes,
        ...getThemeOptions(themes, state.defaults),
      };
    }
    default: {
      return state;
    }
  }
};

export default settings;

/**
 * SETTINGS
 */
function getInitialSettings() {
  const defaultLayoutStyle = FuseSettingsConfig.layout.style ? FuseSettingsConfig.layout.style : "layout1";
  const layout = {
    style: defaultLayoutStyle,
    config: FuseLayoutConfigs[defaultLayoutStyle].defaults,
  };
  return merge({}, defaultSettings, { layout }, FuseSettingsConfig, getParsedQuerySettings());
}

/**
 * THEMES
 */
function getInitialThemes() {
  const themesObj = Object.keys(FuseThemesConfig).length !== 0 ? FuseThemesConfig : defaultThemes;

  const themes = Object.assign(
    {},
    ...Object.entries(themesObj).map(([key, value]) => {
      const muiTheme = merge({}, defaultThemeOptions, value, mustHaveThemeOptions);
      return {
        [key]: createTheme(merge({}, muiTheme, { mixins: extendThemeWithMixins(muiTheme) })),
      };
    }),
  );

  return {
    ...themes,
    ...mainThemeVariations(themesObj[initialSettings.theme.main]),
  };
}

function updateMainThemeVariations(mainTheme) {
  const themesObj = Object.keys(FuseThemesConfig).length !== 0 ? FuseThemesConfig : defaultThemes;
  return mainThemeVariations(themesObj[mainTheme]);
}

function getThemeOptions(themes, settings) {
  return {
    mainTheme: themes[settings.theme.main],
    navbarTheme: themes[settings.theme.navbar],
    toolbarTheme: themes[settings.theme.toolbar],
    footerTheme: themes[settings.theme.footer],
    ...updateMainThemeVariations(settings.theme.main),
  };
}

export function generateSettings(defaultSettings, newSettings) {
  return merge(
    {},
    defaultSettings,
    newSettings?.layout?.style
      ? {
          layout: {
            config: FuseLayoutConfigs[newSettings.layout.style].defaults,
          },
        }
      : {},
    newSettings,
  );
}
