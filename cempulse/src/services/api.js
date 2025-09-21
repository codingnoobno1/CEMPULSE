const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const fetchProcessData = async (processId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/process/${processId}`);
        if (!response.ok) throw new Error('Failed to fetch process data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching process data:', error);
        throw error;
    }
};

export const fetchGeminiAnalysis = async (processData) => {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Analyze this cement manufacturing process data and provide optimization insights:
                               ${JSON.stringify(processData)}`
                    }]
                }]
            })
        });

        if (!response.ok) throw new Error('Failed to get Gemini analysis');
        return await response.json();
    } catch (error) {
        console.error('Error getting Gemini analysis:', error);
        throw error;
    }
};

export const requestManagerApproval = async (processId, analysis) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/approval/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                processId,
                analysis,
                timestamp: new Date().toISOString(),
                status: 'pending'
            })
        });

        if (!response.ok) throw new Error('Failed to request approval');
        return await response.json();
    } catch (error) {
        console.error('Error requesting approval:', error);
        throw error;
    }
};
