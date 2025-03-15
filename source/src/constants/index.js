export const apiUrl = process.env.REACT_APP_API;
export const gameUrl = process.env.REACT_APP_GAME_API;
export const siteUrl = process.env.REACT_APP_SITE_URL;
export const showMenu = process.env.PLUGIN_ADVANCED_TRAINING_ENABLED;
export const enableExposure = process.env.REACT_APP_ENABLE_EXPOSURE === 'true';
export const smtpSettings = JSON.parse(process.env.REACT_APP_SMTP_SETTING ?? 'true');

export const fixedPath = {
    privacy: `${apiUrl}${process.env.REACT_APP_PRIVACY_PATH}`,
    help: `${apiUrl}${process.env.REACT_APP_HELP_PATH}`,
    aboutUs: `${apiUrl}${process.env.REACT_APP_ABOUT_US_PATH}`,
};

//Cyber++ Vista

export const brandName = 'Agilyte Drag';

export const appName = 'drag-app';

export const storageKeys = {
    USER_ACCESS_TOKEN: `${appName}-user-access-token`,
    USER_REFRESH_TOKEN: `${appName}-user-refresh-token`,
};

export const AppConstants = {
    apiRootUrl: process.env.REACT_APP_API,
    gameRootUrl: process.env.REACT_APP_GAME_API,
    contentRootUrl: `${process.env.REACT_APP_API}v1/file/download`,
    langKey: 'vi',
    encryptKey: process.env.REACT_APP_ENC_KEY,
};

export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const defaultLocale = 'en';
export const locales = [ 'en', 'vi' ];

export const activityType = {
    GAME: 'game',
    VIDEO: 'video',
    ARTICLE: 'article',
    FOCUS_AREA: 'focus-area',
};

export const DATE_DISPLAY_FORMAT = 'DD-MM-YYYY HH:mm';
export const DATE_SHORT_MONTH_FORMAT = 'DD MMM YYYY';
export const DATE_FORMAT = 'DD MMM YYYY HH:mm';
export const TIME_FORMAT_DISPLAY = 'HH:mm';
export const DEFAULT_FORMAT = 'DD MM YYYY HH:mm:ss';
export const DATE_FORMAT_VALUE = 'DD-MM-YYYY';

export const navigateTypeEnum = {
    PUSH: 'PUSH',
    POP: 'POP',
    REPLACE: 'REPLACE',
};

export const articleTypeEnum = {
    URL: 'url',
    PLAIN: 'plain',
};

export const accessRouteTypeEnum = {
    NOT_LOGIN: false,
    REQUIRE_LOGIN: true,
    BOTH: null,
};

export const UploadFileTypes = {
    AVATAR: 'AVATAR',
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
};

export const LIMIT_IMAGE_SIZE = 512000;
export const LIMIT_PAGE = 50;

export const STATUS_UNPUBLISHED = 0;
export const STATUS_PUBLISHED = 1;
export const STATUS_VERIFYING = -1;
export const STATUS_DELETE = -2;

export const DEFAULT_TABLE_ITEM_SIZE = 20;

export const commonStatus = {
    PENDING: 0,
    ACTIVE: 1,
    LOCK: -1,
    DELETE: -2,
};

export const commonStatusColor = {
    [commonStatus.PENDING]: 'warning',
    [commonStatus.ACTIVE]: 'green',
    [commonStatus.LOCK]: 'red',
};

export const appVersion = process.env.REACT_APP_APP_VERSION;

export const MAX_TITLE_LENGTH = 40;
export const MAX_TITLE_LENGTH_TITLE = 100;
export const MAX_DESCRIPTION_LENGTH = 255;
export const MAX_DESCRIPTION_LENGTH_500 = 500;
export const MAX_DESCRIPTION_LENGTH_1000 = 1000;

export const STATE_INVITE_PENDING = '0';
export const STATE_INVITE_ACCEPTED = '1';
export const STATE_INVITE_DECLINED = '-1';
export const STATE_INVITE_WITHDRAWN = '-2';
export const STATE_INVITE_EXPIRED = '-3';
export const DEFAULT_LANGUAGE_ID = '1';

export const MAX_WIDTH_IMAGE_DEFAULT = 1296;
export const NORMAL_PARSERS = 'normal';
export const REPORT_PARSERS = 'report';
export const SIZE_FILE_10 = 10;
export const SIZE_FILE_1000 = 1000;

export const STATE_PROGRESS_SETTLED = 0;
export const STATE_PROGRESS_QUEUE = 1;
export const STATE_PROGRESS_PROGRESS = 2;
export const STATE_PROGRESS_COMPLETED = 3;
export const STATE_PROGRESS_FAILED = -1;
export const STATE_PROGRESS_STUCK = -2;
export const STATE_PROGRESS_UNKNOWN = -3;
export const STATE_PROGRESS_CANCELED = -4;

export const emailRegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
