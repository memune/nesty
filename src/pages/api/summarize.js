import axios from 'axios';
import { getUserMetadata } from '@/firebase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const firestoreData = await fetchFirestoreData();
        const summarizedData = await sendToGPTAPI(firestoreData);
        res.status(200).json({ summary: summarizedData });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}

async function fetchFirestoreData() {
    const data = await getUserMetadata('683E9C7wMPVFYCcLPnQCC2lrvLx2'); // userId를 적절하게 설정해주세요.
    return data.map(item => item.content).join(' ').substring(0, 4000); // 최대 4000자까지만 가져옵니다.
}

async function sendToGPTAPI(data) {
    const API_URL = "https://api.openai.com/v1/engines/davinci/completions";
    const API_KEY = "apikey"; // 실제 키로 교체

    const response = await axios.post(API_URL, {
        prompt: `Translate and summarize: ${data}`,
        max_tokens: 150
    }, {
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        }
    });

    return response.data.choices[0].text.trim();
}
