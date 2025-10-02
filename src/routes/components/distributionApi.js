export async function fetchDistributionData() {
    try {
        const response = await fetch('https://launcher.ionnet.work/distribution.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.servers || [];
    } catch (error) {
        console.error('Failed to fetch distribution data:', error);
        throw error;
    }
}
