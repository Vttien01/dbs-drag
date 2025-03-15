import {
    STATUS_PUBLISHED,
    STATUS_VERIFYING,
    STATUS_UNPUBLISHED,
    STATE_INVITE_PENDING,
    STATE_INVITE_ACCEPTED,
    STATE_INVITE_DECLINED,
    STATE_INVITE_WITHDRAWN,
    STATE_INVITE_EXPIRED,
    STATE_PROGRESS_SETTLED,
    STATE_PROGRESS_QUEUE,
    STATE_PROGRESS_PROGRESS,
    STATE_PROGRESS_COMPLETED,
    STATE_PROGRESS_FAILED,
    STATE_PROGRESS_STUCK,
    STATE_PROGRESS_UNKNOWN,
    STATE_PROGRESS_CANCELED,
} from '@constants';
import { defineMessage } from 'react-intl';
// import { inviteStateMessage } from './intl';
// export const dataMap = {
//     [activityType.GAME]: {
//         title: 'GAMES',
//         getActivityList: gameActions.gameList,
//         getActivityCategories: gameActions.gameCatagories,
//         urlDetails: routes.gameDetailsPage.path,
//     },
//     [activityType.ARTICLE]: {
//         title: 'ARTICLES',
//         getActivityList: articleActions.articleList,
//         getActivityCategories: articleActions.articleCatagories,
//         urlDetails: routes.articleDetailsPage.path,
//     },
//     [activityType.VIDEO]: {
//         title: 'VIDEOS',
//         getActivityList: videoActions.videoList,
//         getActivityCategories: videoActions.videoCatagories,
//         urlDetails: routes.videoDetailsPage.path,
//     },
// };

const commonMessage = defineMessage({
    status: {
        active: {
            id: 'constants.masterData.commonMessage.status.active',
            defaultMessage: 'Active',
        },
        published: {
            id: 'constants.masterData.commonMessage.status.published',
            defaultMessage: 'Published',
        },
        unPublished: {
            id: 'constants.masterData.commonMessage.status.unPublished',
            defaultMessage: 'Unpublished',
        },
        pending: {
            id: 'constants.masterData.commonMessage.status.pending',
            defaultMessage: 'Pending',
        },
        lock: {
            id: 'constants.masterData.commonMessage.status.lock',
            defaultMessage: 'Inactive',
        },
    },
    site: {
        type: {
            top: {
                id: 'constants.masterData.commonMessage.site.type.top',
                defaultMessage: 'Top Site',
            },
            campaign: {
                id: 'constants.masterData.commonMessage.site.type.campaign',
                defaultMessage: 'Campaign Site',
            },
        },
        layout: {
            default: {
                id: 'constants.masterData.commonMessage.site.layout.default',
                defaultMessage: 'Default Layout',
            },
            red: {
                id: 'constants.masterData.commonMessage.site.layout.red',
                defaultMessage: 'Red Layout',
            },
            blue: {
                id: 'constants.masterData.commonMessage.site.layout.blue',
                defaultMessage: 'Blue Layout',
            },
            temp: {
                id: 'constants.masterData.commonMessage.site.layout.temp',
                defaultMessage: 'Temp Top Site Layout',
            },
            redCyber: {
                id: 'constants.masterData.commonMessage.site.layout.redCyber',
                defaultMessage: 'Cyber Red Top Site Layout',
            },
            cyberWellness: {
                id: 'constants.masterData.commonMessage.site.layout.cyberWellness',
                defaultMessage: 'Wellness Layout',
            },
            simple: {
                id: 'constants.masterData.commonMessage.site.layout.simple',
                defaultMessage: 'Simple Training Layout',
            },
        },
    },
    filter: {
        contain: {
            id: 'constants.masterData.commonMessage.filter.contain',
            defaultMessage: 'Contains',
        },
        isExacly: {
            id: 'constants.masterData.commonMessage.filter.isExacly',
            defaultMessage: 'Is exacly',
        },
        startWith: {
            id: 'constants.masterData.commonMessage.filter.startWith',
            defaultMessage: 'Start with',
        },
        endWith: {
            id: 'constants.masterData.commonMessage.filter.endWith',
            defaultMessage: 'End with',
        },
        date: {
            id: 'constants.masterData.commonMessage.filter.date',
            defaultMessage: 'Date',
        },
        dateRange: {
            id: 'constants.masterData.commonMessage.filter.dateRange',
            defaultMessage: 'Between ... and ...',
        },
        today: {
            id: 'constants.masterData.commonMessage.filter.today',
            defaultMessage: 'Today',
        },
        yesterday: {
            id: 'constants.masterData.commonMessage.filter.yesterday',
            defaultMessage: 'Yesterday',
        },
        thisWeek: {
            id: 'constants.masterData.commonMessage.filter.thisWeek',
            defaultMessage: 'This week',
        },
        lastWeek: {
            id: 'constants.masterData.commonMessage.filter.lastWeek',
            defaultMessage: 'Last week',
        },
    },
    telemetry: {
        normal: {
            parser: {
                id: 'constants.masterData.commonMessage.telemetry.normal.parser',
                defaultMessage: 'Email phishing parser',
            },
            dlp: {
                id: 'constants.masterData.commonMessage.telemetry.normal.dlp',
                defaultMessage: 'DLP incidents parser',
            },
            mobile_web: {
                id: 'constants.masterData.commonMessage.telemetry.normal.mobile_web',
                defaultMessage: 'Mobile parser',
            },
        },
    },
});

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const orderOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export const commonStatus = [
    { value: STATUS_PUBLISHED, label: 'Kích hoạt', color: 'green' },
    { value: STATUS_UNPUBLISHED, label: 'Đang chờ', color: 'warning' },
    { value: STATUS_VERIFYING, label: 'Đang khóa', color: 'red' },
];

export const statusOptions = [
    { value: STATUS_PUBLISHED, label: commonMessage.status.published, color: '#00A648' },
    { value: STATUS_UNPUBLISHED, label: commonMessage.status.unPublished, color: '#CC0000' },
];

export const allianceStatusOptions = [
    { value: STATUS_PUBLISHED, label: 'Active', color: '#00A648' },
    { value: STATUS_UNPUBLISHED, label: 'Inactive', color: '#CC0000' },
];

export const userMgtStatusOptions = [
    { value: STATUS_PUBLISHED, label: 'Active', color: '#00A648' },
    { value: STATUS_UNPUBLISHED, label: 'Inactive', color: '#CC0000' },
    { value: STATUS_VERIFYING, label: 'Verifying', color: '#ffd233' },
];

export const filterBaseOption = [
    { value: 0, label: commonMessage.filter.contain },
    { value: 1, label: commonMessage.filter.isExacly },
    { value: 2, label: commonMessage.filter.startWith },
    { value: 3, label: commonMessage.filter.endWith },
];

export const filterDateOption = [
    { value: 'date', label: commonMessage.filter.date },
    { value: 'between', label: commonMessage.filter.dateRange },
    { value: 6, label: commonMessage.filter.today },
    { value: 7, label: commonMessage.filter.yesterday },
    { value: 8, label: commonMessage.filter.thisWeek },
    { value: 9, label: commonMessage.filter.lastWeek },
];

export const siteTypeOptions = [
    { value: 'top_site', label: commonMessage.site.type.top },
    { value: 'campaign_site', label: commonMessage.site.type.campaign },
];

export const siteLayoutOptions = [
    { value: 'cyber_red_layout', label: commonMessage.site.layout.redCyber },
    { value: 'red_layout', label: commonMessage.site.layout.red },
    { value: 'blue_layout', label: commonMessage.site.layout.blue },
    { value: 'temp_layout', label: commonMessage.site.layout.temp },
];

export const siteCampaignLayoutOptions = [
    { value: 'default_layout', label: commonMessage.site.layout.default },
    { value: 'wellness_layout', label: commonMessage.site.layout.cyberWellness },
    { value: 'simple_training_layout', label: commonMessage.site.layout.simple },
];

export const campaignSiteLayoutOptions = [ { value: 'default_layout', label: commonMessage.site.layout.default } ];

export const gameCategories = {
    'multiple-choice': {
        path: 'multiple-choice',
        type: 'mcq',
        name: 'Quiz',
    },
    'multiple-choice-2': {
        path: 'multiple-choice-2',
        type: 'mcq2',
        name: 'Quiz v2',
    },
    'multiple-choice-3': {
        path: 'multiple-choice-3',
        type: 'mcq3',
        name: 'Quiz v3',
    },
    'cross-word': {
        path: 'cross-word',
        type: 'crossword',
        name: 'Crossword',
    },
    hangman: {
        path: 'hangman',
        type: 'hangman',
        name: 'Hangman',
    },
    'spot-the-mistake': {
        path: 'spot-the-mistake',
        type: 'spot_the_mistake',
        name: 'Spot the Mistake',
    },
    'phish-identify': {
        path: 'phish-identify',
        type: 'phish_identify',
        name: 'Phish Identify',
    },
    spaceman: {
        path: 'spaceman',
        type: 'spaceman',
        name: 'Spaceman',
    },
    'picture-match': {
        path: 'picture-match',
        type: 'picture_match',
        name: 'Picture Match',
    },
    flowchart: {
        path: 'flowchart',
        type: 'flowchart',
        name: 'Flowchart',
    },
    swipe: {
        path: 'swipe',
        type: 'swipe',
        name: 'Swipe',
    },
};

export const telemetryCategories = {
    email_phishing_parser: 'email-parser',
    dlp_incidents_parser: 'dlp-parser',
    mobile_parser: 'mobile-parser',
    phishing_reports_parser_1: 'phishing-report-1',
    phishing_reports_parser_2: 'phishing-report-2',
    phishing_reports_parser_3: 'phishing-report-3',
    phishing_reports_parser_4: 'phishing-report-4',
    yammer: 'yammer-report',
};

export const gameDisplayModeOptions = [
    { label: 'Landscape', value: 'landscape', width: 960, height: 540 },
    { label: 'Portrait', value: 'portrait', width: 540, height: 960 },
    { label: 'Custom', value: 'custom' },
];

export const telemetryCurrentSteps = {
    pending: { value: 1, label: 'Pending', color: '#ffd233' },
    running: { value: 2, label: 'Running', color: '#00A648' },
};

export const telemetryStates = {
    disabled: 1,
    enabled: 2,
};

export const allianceRules = {
    alliance_play_game: [ ' members play at least ', ' games ' ],
    alliance_watch_video: [ ' members watch at least ', ' videos ' ],
    alliance_read_article: [ ' members read at least ', ' articles ' ],
    alliance_read_infographic: [ ' members read at least ', ' infographics ' ],
    alliance_view_webpage: [ ' members read view least ', ' webpages ' ],
};

export const allianceOptions = [
    { value: 'alliance_play_game', label: 'games' },
    { value: 'alliance_read_article', label: 'articles' },
    { value: 'alliance_watch_video', label: 'videos' },
    { value: 'alliance_read_infographic', label: 'infographics' },
    { value: 'alliance_view_webpage', label: 'webpages' },
];

export const allianceOptionsLabel = {
    alliance_play_game: 'play',
    alliance_read_article: 'read',
    alliance_watch_video: 'watch',
    alliance_read_infographic: 'read',
    alliance_view_webpage: 'read',
};

export const DEFAULT_FONT_FAMILY = 'Arial';
export const DEFAULT_TEXT_TYPE = 'recipient_name';

export const fontFamilySelects = [
    { value: DEFAULT_FONT_FAMILY, label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
];

export const textTypeSelects = [
    { value: DEFAULT_TEXT_TYPE, label: 'Recipient name' },
    { value: 'service_name', label: 'Service name' },
    { value: 'date_of_completion', label: 'Date of completion' },
    { value: 'certificate_id', label: 'Certificate id' },
    { value: 'course duration', label: 'Course duration' },
];

export const editTypes = {
    TEXT: 'text',
    IMAGE: 'image',
    URL: 'link',
};

export const inviteState = [
    { value: STATE_INVITE_PENDING, label: 'Pending', color: 'blue' },
    { value: STATE_INVITE_ACCEPTED, label: 'Accepted', color: 'green' },
    { value: STATE_INVITE_DECLINED, label: 'Declined', color: 'warning' },
    { value: STATE_INVITE_WITHDRAWN, label: 'Withdrawn', color: 'yellow' },
    { value: STATE_INVITE_EXPIRED, label: 'Expired', color: 'red' },
];

export const vitalScoreType = [
    { value: 'phishing', label: 'Phishing' },
    { value: 'dlp', label: 'DLP' },
    { value: 'mobile_web', label: 'Mobile' },
    { value: 'awareness', label: 'Awareness' },
    { value: 'training', label: 'Training' },
];
export const parserTypeReport = {
    phishing: { value: 'phishing', label: 'Email Phishing Reports' },
    dlp: { value: 'dlp', label: 'DLP Incidents Reports' },
    mobile_web: { value: 'mobile_web', label: 'Mobile Reports' },
    awareness: { value: 'awareness', label: 'Awareness - Yammer' },
    training: { value: 'training', label: 'Training Reports' },
};
export const parserTypeNormal = {
    phishing: { value: 'phishing', label: 'Email Phishing Parser' },
    dlp: { value: 'dlp', label: 'DLP Incidents Parser' },
    mobile_web: { value: 'mobile_web', label: 'Mobile Parser' },
};

export const scoreProgressType = {
    amend: { value: 'amend', label: 'Amendment' },
    compute: { value: 'compute', label: 'Deduction' },
    recover: { value: 'recover', label: 'Recover' },
    report: { value: 'report', label: 'Award from report' },
};

export const resourceAuditTrail = [
    { value: 'activity', label: 'Activity' },
    { value: 'alliance', label: 'Alliance' },
    { value: 'alliance_challenge', label: 'Alliance challenge' },
    { value: 'alliance_member', label: "Alliance's member(s)" },
    { value: 'announcement', label: 'Announcement' },
    { value: 'article', label: 'Article' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'category', label: 'Category' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'daily_challenge', label: 'Daily challenge' },
    { value: 'infographic', label: 'Infographic' },
    { value: 'ip_whitelist', label: 'IP Whitelist' },
    { value: 'game', label: 'Game' },
    { value: 'game_question', label: "Game's question(s)" },
    { value: 'html_media', label: 'Webpage' },
    { value: 'language', label: 'Language' },
    { value: 'medal', label: 'Medal' },
    { value: 'media_server', label: 'Global library' },
    { value: 'meta_game', label: 'Meta game' },
    { value: 'permission', label: 'Permission' },
    { value: 'report', label: 'Report' },
    { value: 'setting', label: 'Setting' },
    { value: 'site', label: 'Site' },
    { value: 'task', label: 'Task' },
    { value: 'task_item', label: "Task's item(s)" },
    { value: 'telemetry', label: 'Telemetry' },
    { value: 'telemetry_template', label: 'Telemetry template' },
    { value: 'telemetry_schedule', label: 'Telemetry Schedule' },
    { value: 'telemetry_vital_score', label: 'Telemetry vital score' },
    { value: 'user', label: 'User' },
    { value: 'user_blacklist', label: 'User blacklist' },
    { value: 'user_onboard', label: 'User Onboard' },
    { value: 'user_whitelist', label: 'User whitelist' },
    { value: 'video', label: 'Video' },
];

export const actionAuditTrail = [
    { value: 'login', label: 'Login' },
    { value: 'login_ldap', label: 'Login with LDAP' },
    { value: 'verify_otp', label: 'Verify OTP' },
    { value: 'update_profile', label: 'Update profile' },
    { value: 'create', label: 'Create' },
    { value: 'update', label: 'Update' },
    { value: 'batch_update', label: 'Batch update' },
    { value: 'update_ordering', label: 'Update ordering' },
    { value: 'switch_important_announcement', label: 'Switch important announcement' },
    { value: 'update_task_num_daily_challenge', label: 'Update task number of daily challenge' },
    { value: 'reset_user_progress_daily_challenge', label: 'Reset a user progress of daily challenge' },
    { value: 'reset_all_user_progress_daily_challenge', label: 'Reset all user progresses of daily challenge' },
    { value: 'delete', label: 'Delete' },
    { value: 'upload', label: 'Upload' },
    { value: 'aggregate_report', label: 'Aggregate report' },
    { value: 'update_site_weightage', label: 'Update site weightage setting' },
    { value: 'update_site_referral', label: 'Update site referral setting' },
    { value: 'duplicate_site', label: 'Duplicate site' },
    { value: 'telemetry_process_data', label: 'Telemetry process data immediately' },
    { value: 'telemetry_check_task', label: 'Telemetry check task immediately' },
    { value: 'amend_vital_score', label: "Amend user's vital score" },
    { value: 'select_action', label: 'Select Action' },
];

export const parserOptions = [
    { value: 'phishing', label: 'Email phishing parser', type: 'normal', vitalScoreType: 'phishing' },
    { value: 'dlp', label: 'DLP incidents parser', type: 'normal', vitalScoreType: 'dlp' },
    { value: 'mobile_web', label: 'Mobile parser', type: 'normal', vitalScoreType: 'mobile_web' },
    { value: 'awareness', label: 'Awareness - Yammer', type: 'report', vitalScoreType: 'awareness' },
    { value: 'phishing_report', label: 'Email phishing Reports', type: 'report', vitalScoreType: 'phishing' },
    { value: 'dlp_report', label: 'DLP Incidents Reports', type: 'report', vitalScoreType: 'dlp' },
    { value: 'mobile_web_report', label: 'Mobile Reports', type: 'report', vitalScoreType: 'mobile_web' },
    { value: 'training', label: 'Training Reports', type: 'report', vitalScoreType: 'training' },
];
export const groupTelemetries = {
    normal: [
        {
            name: 'Email phishing parser',
            vitalScoreType: 'phishing',
            type: 'normal',
            key: 'email_phishing_parser',
        },
        {
            name: 'DLP incidents parser',
            vitalScoreType: 'dlp',
            type: 'normal',
            key: 'dlp_incidents_parser',
        },
        {
            name: 'Mobile parser',
            vitalScoreType: 'mobile_web',
            type: 'normal',
            key: 'mobile_parser',
        },
    ],
    report: [
        {
            name: 'Awareness - Yammer',
            vitalScoreType: 'awareness',
            type: 'report',
            key: 'yammer',
        },
        {
            name: 'Email phishing Reports',
            vitalScoreType: 'phishing',
            type: 'report',
            key: 'phishing_reports_parser_1',
        },
        {
            name: 'DLP Incidents Reports',
            vitalScoreType: 'dlp',
            type: 'report',
            key: 'phishing_reports_parser_2',
        },
        {
            name: 'Mobile Reports',
            vitalScoreType: 'mobile_web',
            type: 'report',
            key: 'phishing_reports_parser_3',
        },
        {
            name: 'Training Reports',
            vitalScoreType: 'training',
            type: 'report',
            key: 'phishing_reports_parser_4',
        },
    ],
};

export const telemetryNameConfig = {
    normal: {
        phishing: 'Email phishing parser',
        dlp: 'DLP incidents parser',
        mobile_web: 'Mobile parser',
    },
    report: {
        awareness: 'Awareness - Yammer',
        phishing: 'Email phishing Reports',
        dlp: 'DLP Incidents Reports',
        mobile_web: 'Mobile Reports',
        training: 'Training Reports',
    },
};

export const stateJobProgresses = [
    { value: STATE_PROGRESS_QUEUE, label: 'In Queue', color: 'rgba(249, 121, 52, 0.87)' },
    { value: STATE_PROGRESS_PROGRESS, label: 'In Progress', color: '#108ee9' },
    { value: STATE_PROGRESS_COMPLETED, label: 'Completed', color: '#87d068' },
    { value: STATE_PROGRESS_FAILED, label: 'Failed', color: 'rgb(255, 30, 0)' },
    { value: STATE_PROGRESS_STUCK, label: 'Stuck', color: 'red' },
    { value: STATE_PROGRESS_UNKNOWN, label: 'Unknown', color: 'red' },
    { value: STATE_PROGRESS_CANCELED, label: 'Canceled', color: '#d2d1d1' },
    { value: STATE_PROGRESS_SETTLED, label: 'Settled', color: 'gray' },
];
