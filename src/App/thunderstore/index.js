
setup.consumes = ['utility', 'config', 'settings'];
setup.provides = ['thunderstore'];

export default function setup(imports, register) {

    var path_prefix = 'https://thunderstore.io'
    var { https } = imports.utility;

    var cache = imports.config('thunderstore_cache', {
        request: JSON.stringify({})
    })

    var setRequestCache = function (name, value) {
        var c = JSON.parse(cache.request);
        c[name] = value;
        cache.request = JSON.stringify(c);
    }
    var getRequestCache = function (name) {
        var c = JSON.parse(cache.request);
        return c[name];
    }

    async function api_request(path, callback) {
        return imports.utility.request_json(path_prefix + path, callback)
    }

    async function community() {
        // /api/experimental/community/
        return (await api_request('/api/experimental/community/')).results
    }
    async function community_packages(community) {
        var cacheKey = community + '_mods';
        var cacheFile = imports.settings.data_dir + '\\_app_cache\\' + cacheKey;
        var needsUpdate = false;
        var l = getRequestCache(cacheKey);
        var n = new Date().getTime();
        if (!l || (n + (1000 * 60 * 60)) <= l) {
            needsUpdate = true;
            setRequestCache(cacheKey, new Date().getTime());
        }
        if (needsUpdate) {
            var requestData = (await api_request('/c/' + community + '/api/v1/package/'));
            await imports.utility.writeFile(cacheFile, JSON.stringify(requestData));
        }
        var d = JSON.parse(await imports.utility.readFile(cacheFile));
        return d;
        // /c/{community_identifier}/api/v1/package/
    }
    async function package_metrics(nameSpace, packageName) {
        // /api/v1/package-metrics/{namespace}/{name}/
    }
    async function package_metrics_for_version(nameSpace, packageName, packageVersion) {
        // /api/v1/package-metrics/{namespace}/{name}/{version}/
    }
    async function package_download(nameSpace, packageName, packageVersion) {
        // /package/download/{namespace}/{name}/{version}/
    }

    register(null, {
        thunderstore: {
            community,
            community_packages,
            package_metrics,
            package_metrics_for_version,
            package_download
        }
    });
}
