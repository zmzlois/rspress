function pluginAlgolia(options = {}) {
    const { verificationContent } = options;
    return {
        name: '@rspress/plugin-algolia',
        config (config) {
            config.search = false;
            return config;
        },
        builderConfig: {
            html: {
                meta: verificationContent ? {
                    'algolia-site-verification': {
                        name: 'algolia-site-verification',
                        content: verificationContent
                    }
                } : {}
            }
        }
    };
}
export { pluginAlgolia };
