import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        const response = await fetch('https://launcher.ionnet.work/distribution.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return json(data.servers || []);
    } catch (error) {
        console.error('Failed to fetch distribution data:', error);
        return json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}
