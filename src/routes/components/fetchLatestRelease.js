// fetchLatestRelease.js

// Replace these with your actual GitHub username/organization and repository name
const owner = 'IONNetworkTeam';
const repo = 'IONLauncher';

// Function to fetch the latest release information from GitHub API
export async function fetchLatestReleases() {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const releaseData = await response.json();

        // Extract the assets
        const assets = releaseData.assets;

        // Initialize download links object with nested structure
        const downloadLinks = {
            Windows: {
                downloadUrl: null,
                fileName: null
            },
            MacOS: {
                armUrl: null,
                x64Url: null,
                armFileName: null,
                x64FileName: null
            },
            Linux: {
                flatpakUrl: null,
                appimageUrl: null,
                tarUrl: null,
                flatpakFileName: null,
                appimageFileName: null,
                tarFileName: null
            },
        };

        // Iterate over assets to categorize downloads by OS and architecture
        assets.forEach((asset) => {
            const { name, browser_download_url } = asset;
            const nameLower = name.toLowerCase();

            // Windows files
            if (nameLower.endsWith('.exe') || nameLower.endsWith('.msi')) {
                downloadLinks.Windows.downloadUrl = browser_download_url;
                downloadLinks.Windows.fileName = name;
            }

            // macOS files
            else if (nameLower.endsWith('.dmg') || nameLower.endsWith('.pkg')) {
                // Check for ARM/Apple Silicon indicators
                if (nameLower.includes('arm64') || nameLower.includes('apple') || nameLower.includes('m1') || nameLower.includes('m2')) {
                    downloadLinks.MacOS.armUrl = browser_download_url;
                    downloadLinks.MacOS.armFileName = name;
                }
                // Check for x64/Intel indicators
                else if (nameLower.includes('x64') || nameLower.includes('intel') || nameLower.includes('x86_64')) {
                    downloadLinks.MacOS.x64Url = browser_download_url;
                    downloadLinks.MacOS.x64FileName = name;
                }
                // If no specific architecture is indicated, assume x64 (most common)
                else {
                    downloadLinks.MacOS.x64Url = browser_download_url;
                    downloadLinks.MacOS.x64FileName = name;
                }
            }

            // Linux files
            else if (nameLower.endsWith('.appimage')) {
                downloadLinks.Linux.appimageUrl = browser_download_url;
                downloadLinks.Linux.appimageFileName = name;
            }
            else if (nameLower.endsWith('.flatpak')) {
                downloadLinks.Linux.flatpakUrl = browser_download_url;
                downloadLinks.Linux.flatpakFileName = name;
            }
            else if (nameLower.endsWith('.tar.gz') || nameLower.endsWith('.tar.xz')) {
                downloadLinks.Linux.tarUrl = browser_download_url;
                downloadLinks.Linux.tarFileName = name;
            }
            // Handle .deb files
            else if (nameLower.endsWith('.deb')) {
                // If no AppImage is available, use .deb as alternative
                if (!downloadLinks.Linux.appimageUrl) {
                    downloadLinks.Linux.appimageUrl = browser_download_url;
                    downloadLinks.Linux.appimageFileName = name;
                }
            }
            // Handle .rpm files
            else if (nameLower.endsWith('.rpm')) {
                // If no other Linux format is available, use .rpm
                if (!downloadLinks.Linux.appimageUrl && !downloadLinks.Linux.flatpakUrl) {
                    downloadLinks.Linux.appimageUrl = browser_download_url;
                    downloadLinks.Linux.appimageFileName = name;
                }
            }
        });

        // Fallback logic for macOS - if we only have one .dmg/.pkg file, make it available for both architectures
        if ((downloadLinks.MacOS.armUrl && !downloadLinks.MacOS.x64Url) || (!downloadLinks.MacOS.armUrl && downloadLinks.MacOS.x64Url)) {
            const singleUrl = downloadLinks.MacOS.armUrl || downloadLinks.MacOS.x64Url;
            const singleFileName = downloadLinks.MacOS.armFileName || downloadLinks.MacOS.x64FileName;

            // If the filename doesn't specify architecture, make it available for both
            const nameLower = singleFileName?.toLowerCase() || '';
            if (!nameLower.includes('arm64') && !nameLower.includes('x64') && !nameLower.includes('intel') && !nameLower.includes('apple')) {
                downloadLinks.MacOS.armUrl = singleUrl;
                downloadLinks.MacOS.x64Url = singleUrl;
                downloadLinks.MacOS.armFileName = singleFileName;
                downloadLinks.MacOS.x64FileName = singleFileName;
            }
        }

        return downloadLinks;
    } catch (error) {
        console.error('Error fetching release data from GitHub API:', error);
        throw error;
    }
}

// Helper function to get a simplified download structure (backward compatibility)
export async function getSimpleDownloadLinks() {
    const detailedLinks = await fetchLatestReleases();

    return {
        Windows: detailedLinks.Windows.downloadUrl ? {
            fileName: detailedLinks.Windows.fileName,
            downloadUrl: detailedLinks.Windows.downloadUrl
        } : null,
        MacOS: (detailedLinks.MacOS.armUrl || detailedLinks.MacOS.x64Url) ? {
            fileName: detailedLinks.MacOS.armFileName || detailedLinks.MacOS.x64FileName,
            downloadUrl: detailedLinks.MacOS.armUrl || detailedLinks.MacOS.x64Url
        } : null,
        Linux: (detailedLinks.Linux.appimageUrl || detailedLinks.Linux.flatpakUrl || detailedLinks.Linux.tarUrl) ? {
            fileName: detailedLinks.Linux.appimageFileName || detailedLinks.Linux.flatpakFileName || detailedLinks.Linux.tarFileName,
            downloadUrl: detailedLinks.Linux.appimageUrl || detailedLinks.Linux.flatpakUrl || detailedLinks.Linux.tarUrl
        } : null
    };
}
