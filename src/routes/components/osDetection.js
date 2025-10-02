// osDetection.js

/**
 * Detects the user's operating system based on user agent and platform information
 * @returns {string} The detected OS: 'windows', 'macos', 'linux', or 'unknown'
 */
export function detectOS() {
    if (typeof navigator === 'undefined') {
        return 'unknown'; // Server-side rendering
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    const appVersion = navigator.appVersion.toLowerCase();

    // Check for Windows
    if (platform.includes('win') || userAgent.includes('windows')) {
        return 'windows';
    }

    // Check for macOS/Mac OS X
    if (platform.includes('mac') || userAgent.includes('mac os') || userAgent.includes('macos')) {
        return 'macos';
    }

    // Check for Linux (including various distributions)
    if (platform.includes('linux') ||
        platform.includes('x11') ||
        userAgent.includes('linux') ||
        userAgent.includes('ubuntu') ||
        userAgent.includes('debian') ||
        userAgent.includes('fedora') ||
        userAgent.includes('arch') ||
        userAgent.includes('manjaro') ||
        userAgent.includes('opensuse') ||
        userAgent.includes('centos') ||
        userAgent.includes('rhel')) {
        return 'linux';
    }

    // Check for mobile operating systems (optional)
    if (userAgent.includes('android')) {
        return 'android';
    }

    if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
        return 'ios';
    }

    return 'unknown';
}

/**
 * Converts OS detection result to platform name used in the application
 * @param {string} detectedOS - The OS detected by detectOS()
 * @returns {string} Platform name: 'Windows', 'MacOS', 'Linux', or null
 */
export function getOSPlatformName(detectedOS) {
    switch (detectedOS) {
        case 'windows':
            return 'Windows';
        case 'macos':
            return 'MacOS';
        case 'linux':
            return 'Linux';
        default:
            return null;
    }
}

/**
 * Gets a more detailed OS information including architecture hints
 * @returns {object} Detailed OS information
 */
export function getDetailedOSInfo() {
    const baseOS = detectOS();
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    let architecture = 'unknown';
    let isAppleSilicon = false;

    // Try to detect architecture
    if (baseOS === 'macos') {
        // Check for Apple Silicon indicators
        if (userAgent.includes('intel') || platform.includes('intel')) {
            architecture = 'x64';
        } else if (userAgent.includes('arm') || userAgent.includes('apple silicon')) {
            architecture = 'arm64';
            isAppleSilicon = true;
        } else {
            // For newer Macs, assume Apple Silicon if no Intel indicators
            architecture = 'arm64';
            isAppleSilicon = true;
        }
    } else if (baseOS === 'windows' || baseOS === 'linux') {
        if (platform.includes('x86_64') || platform.includes('x64') || userAgent.includes('x64')) {
            architecture = 'x64';
        } else if (platform.includes('arm') || userAgent.includes('arm')) {
            architecture = 'arm64';
        } else if (platform.includes('x86') || userAgent.includes('x86')) {
            architecture = 'x86';
        }
    }

    return {
        os: baseOS,
        architecture,
        isAppleSilicon,
        platformName: getOSPlatformName(baseOS),
        userAgent: navigator.userAgent,
        platform: navigator.platform
    };
}

/**
 * Suggests the best download option based on detected OS and architecture
 * @param {object} downloadLinks - The download links object from fetchLatestReleases
 * @returns {object|null} Suggested download option or null if none available
 */
export function suggestBestDownload(downloadLinks) {
    const osInfo = getDetailedOSInfo();

    switch (osInfo.os) {
        case 'windows':
            return downloadLinks.Windows?.downloadUrl ? {
                platform: 'Windows',
                url: downloadLinks.Windows.downloadUrl,
                fileName: downloadLinks.Windows.fileName,
                type: 'installer'
            } : null;

        case 'macos':
            if (osInfo.isAppleSilicon && downloadLinks.MacOS?.armUrl) {
                return {
                    platform: 'MacOS',
                    url: downloadLinks.MacOS.armUrl,
                    fileName: downloadLinks.MacOS.armFileName,
                    type: 'arm64'
                };
            } else if (downloadLinks.MacOS?.x64Url) {
                return {
                    platform: 'MacOS',
                    url: downloadLinks.MacOS.x64Url,
                    fileName: downloadLinks.MacOS.x64FileName,
                    type: 'x64'
                };
            }
            return null;

        case 'linux':
            // Prefer AppImage for better compatibility
            if (downloadLinks.Linux?.appimageUrl) {
                return {
                    platform: 'Linux',
                    url: downloadLinks.Linux.appimageUrl,
                    fileName: downloadLinks.Linux.appimageFileName,
                    type: 'appimage'
                };
            } else if (downloadLinks.Linux?.flatpakUrl) {
                return {
                    platform: 'Linux',
                    url: downloadLinks.Linux.flatpakUrl,
                    fileName: downloadLinks.Linux.flatpakFileName,
                    type: 'flatpak'
                };
            }
            return null;

        default:
            return null;
    }
}