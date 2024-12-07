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

        // Initialize download links object
        const downloadLinks = {
            Windows: null,
            MacOS: null,
            Linux: null,
        };

        // Iterate over assets to find the download URLs for each OS
        assets.forEach((asset) => {
            const { name, browser_download_url } = asset;

            if (name.endsWith('.exe') || name.endsWith('.msi')) {
                downloadLinks.Windows = {
                    fileName: name,
                    downloadUrl: browser_download_url,
                };
            } else if (name.endsWith('.dmg') || name.endsWith('.pkg')) {
                downloadLinks.MacOS = {
                    fileName: name,
                    downloadUrl: browser_download_url,
                };
            } else if (name.endsWith('.AppImage') || name.endsWith('.tar.gz')) {
                downloadLinks.Linux = {
                    fileName: name,
                    downloadUrl: browser_download_url,
                };
            }
        });
        return downloadLinks;
    } catch (error) {
        console.error('Error fetching release data from GitHub API:', error);
        throw error;
    }
}
