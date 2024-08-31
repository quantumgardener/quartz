import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
export function getDate(cfg, data) {
    if (!cfg.defaultDateType) {
        throw new Error(`Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.`);
    }
    return data.dates?.[cfg.defaultDateType];
}
export function formatDate(d, locale = "en-US") {
    return d.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
export function Date({ date, locale }) {
    return _jsx(_Fragment, { children: formatDate(date, locale) });
}
