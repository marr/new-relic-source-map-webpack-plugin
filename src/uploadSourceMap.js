"use strict";
const {publishSourcemap} = require('@newrelic/publish-sourcemap');

module.exports = opts => item => {
    const {
        assets,
        staticAssetUrlBuilder,
        publicPath,
        applicationId,
        nrAdminKey,
        url,
        releaseName,
        releaseId,
        stats
    } = opts;

    const mapFile = assets[`${item}.map`];
    if (mapFile === undefined || !mapFile.emitted) {
        return Promise.resolve();
    }

    const javascriptUrl = staticAssetUrlBuilder(url, publicPath, item, stats);
    return new Promise((resolve, reject) => {
        publishSourcemap({
            sourcemapPath: mapFile.existsAt,
            javascriptUrl,
            applicationId,
            nrAdminKey,
            releaseName,
            releaseId
        }, (err) => {
            if (err) {
                reject(err);
            }
            resolve(javascriptUrl);
        });
    });
};
