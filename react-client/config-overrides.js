module.exports = {
    devServer: configFn => {
        return (proxy, allowedHost) => {
            const config = configFn(proxy, allowedHost);
            config.allowedHosts = [".localhost"];
            return config;
        }
    }
}