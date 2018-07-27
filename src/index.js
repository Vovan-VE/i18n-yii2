import MessageFormat from 'messageformat';

const _global = (
    typeof global !== 'undefined' && global ||
    typeof self !== 'undefined' && self ||
    typeof window !== 'undefined' && window ||
    {}
);
const getGlobalConfig = () => _global['I18N_CONFIG'];

const getLocalizedMessageFormatter = (() => {
    const cache = {};

    const createFormatter = (language) => {
        const formatter = new MessageFormat(language);
        formatter.compiledCache = {};
        return formatter;
    };

    const getFormatter = (language) => {
        const {[language]: formatter = cache[language] = createFormatter(language)} = cache;
        return formatter;
    };

    return (message, language) => {
        const formatter = getFormatter(language);
        const cache = formatter.compiledCache;
        let {[message]: compiled} = cache;
        if (compiled) {
            return compiled;
        }

        compiled = formatter.compile(message);
        return cache[message] = compiled;
    };
})();

const formatMessage = (message, language, params) => {
    return getLocalizedMessageFormatter(message, language)(params || {});
};

class I18N {
    /**
     * Source message language for fallback translation formatting
     * @type {string}
     */
    sourceLanguage = 'en-US';
    /**
     * Current language to translate to by default
     * @type {string}
     */
    language = this.sourceLanguage;
    /**
     * Translations map
     *
     * Structure: `translations[language][category][message] = translation`
     * @type {Object}
     */
    translations = {};

    constructor() {
        this.configure(getGlobalConfig());

        this.__ = this.t = this.translate = this.translate.bind(this);
    }

    /**
     * Change configuration
     * @param {Object} config
     */
    configure(config) {
        if (!config) {
            return;
        }
        const {language, sourceLanguage, translations} = config;
        if (language) {
            this.language = language;
        }
        if (sourceLanguage) {
            this.sourceLanguage = sourceLanguage;
        }
        if (translations) {
            this.addTranslations(translations);
        }
    }

    /**
     * Translate a message
     * @param {string} category Category name
     * @param {string} message Source message
     * @param {Object} [params] Params to replace placeholders in source message
     * @param {string} [language] Target language to translate to
     * @return {string}
     */
    translate(category, message, params = null, language = this.language) {
        let {[category]: {[message]: translation} = {}} = this.translations[language] || {};
        if (translation) {
            return formatMessage(translation, language, params);
        }
        return formatMessage(message, this.sourceLanguage, params);
    }

    /**
     * Add translations
     *
     * Call to `i18n.addTranslations(translations)` is a shortcut
     * to `i18n.configure({translations: translations})`.
     * @param {Object} translations
     */
    addTranslations(translations) {
        const old = this.translations;
        const result = {};
        Object.keys(translations).forEach(language => {
            const newWithLang = translations[language];
            const oldWithLang = old[language] || {};
            const resultWithLang = {};
            Object.keys(newWithLang).forEach(category => {
                resultWithLang[category] = {
                    ...oldWithLang[category] || {},
                    ...newWithLang[category],
                };
            });
            result[language] = resultWithLang;
        });
        this.translations = result;
    }

    /**
     * Remove all translations
     */
    clearTranslations() {
        this.translations = {};
    }
}

const i18n = new I18N();

export default i18n;
