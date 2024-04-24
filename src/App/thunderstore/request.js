
const https = window.nodejs.https;//require('https');

export default async function api_request(path, callback) {
    return new Promise((resolve, reject) => {
        let url = 'https://thunderstore.io' + path;
        https.get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    let json = JSON.parse(body);
                    if (!(typeof callback == 'undefined'))
                        callback(null, json)
                    resolve(json)
                } catch (error) {
                    if (!(typeof callback == 'undefined'))
                        callback(error.message)
                    reject(error.message);
                }
            });
        }).on('error', (error) => {
            console.error(error.message);
        });
    });
}

export async function community() {
    // /api/experimental/community/
    return (await api_request('/api/experimental/community/')).results
}
export async function community_packages(community) {
    // /c/{community_identifier}/api/v1/package/
}
export async function package_metrics(nameSpace, packageName) {
    // /api/v1/package-metrics/{namespace}/{name}/
}
export async function package_metrics_for_version(nameSpace, packageName, packageVersion) {
    // /api/v1/package-metrics/{namespace}/{name}/{version}/
}
export async function package_download(nameSpace, packageName, packageVersion) {
    // /package/download/{namespace}/{name}/{version}/
}

