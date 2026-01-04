import { AIProvider, AISettings, School, ResearchResponse } from '../types';

const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
  anthropic: 'https://api.anthropic.com/v1/messages',
};

const SYSTEM_PROMPT = `You are a helpful college research assistant for high school students. 
Your role is to provide accurate, up-to-date information about colleges and universities.

When asked about a school, provide structured information including:
- Basic info (location, size, setting)
- Rankings (overall national ranking, program-specific rankings)
- Admissions (acceptance rate, test requirements, score ranges)
- Cost (tuition, total COA)
- Academics (top majors with their rankings, notable programs)

Always be encouraging and helpful to students exploring their college options.
Format your responses using markdown for better readability:
- Use **bold** for important terms
- Use bullet points for lists
- Use ### for section headers

IMPORTANT: When you mention specific schools, you MUST include a JSON block at the END of your response with this EXACT structure:
\`\`\`json
{
  "schools": [
    {
      "id": "unique-school-id",
      "name": "Full School Name",
      "location": {
        "city": "City Name",
        "state": "State Abbreviation",
        "setting": "urban" 
      },
      "size": {
        "undergraduate": 12000
      },
      "rankings": {
        "overall": 25,
        "nationalUniversity": 25,
        "engineering": 10,
        "business": 15,
        "source": "US News 2024"
      },
      "admissions": {
        "acceptanceRate": 0.15,
        "testPolicy": "optional",
        "satRange": { "low": 1400, "high": 1550 },
        "actRange": { "low": 32, "high": 35 }
      },
      "cost": {
        "totalCOA": 75000
      },
      "academics": {
        "topMajors": ["Computer Science", "Economics", "Biology"],
        "majorRankings": [
          { "name": "Computer Science", "rank": 5, "source": "US News 2024" },
          { "name": "Economics", "rank": 12, "source": "US News 2024" }
        ]
      },
      "website": "https://www.university.edu"
    }
  ]
}
\`\`\`

Notes for the JSON:
- "setting" must be one of: "urban", "suburban", or "rural"
- "testPolicy" must be one of: "required", "optional", or "not-considered"
- "acceptanceRate" should be a decimal (e.g., 0.15 for 15%)
- "rankings.overall" is the overall national ranking (use nationalUniversity or liberalArts as appropriate)
- "majorRankings" should include rankings for notable programs when available
- "website" should be the school's official website URL
- Include all schools mentioned in your response`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private settings: AISettings | null = null;

  configure(settings: AISettings) {
    this.settings = settings;
  }

  async research(query: string): Promise<ResearchResponse> {
    if (!this.settings || !this.settings.apiKey) {
      throw new Error('AI service not configured. Please add your API key in Settings.');
    }

    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: query },
    ];

    const content = await this.callAPI(messages);
    const schools = this.extractSchools(content);

    return {
      content: this.cleanContent(content),
      schools,
      timestamp: new Date(),
    };
  }

  async researchSchool(schoolName: string): Promise<ResearchResponse> {
    const query = `Tell me about ${schoolName}. Include:
1. Location and campus setting (urban/suburban/rural)
2. Undergraduate enrollment size
3. Acceptance rate and test requirements (SAT/ACT ranges)
4. Total cost of attendance
5. Top 5 most popular majors
6. Any notable facts or distinguishing features`;

    return this.research(query);
  }

  async researchFaculty(schoolName: string, major: string): Promise<ResearchResponse> {
    const query = `Using web search to find the most current information, research notable faculty members in the ${major} department at ${schoolName}.

Please search for and include:
1. **Department Overview**: Brief description of the ${major} department/program at ${schoolName}
2. **Notable Professors**: List 3-5 prominent faculty members with:
   - Their name and title
   - Research areas and specializations
   - Notable publications or achievements
   - Any awards or recognition
3. **Research Opportunities**: What research labs or centers exist in this department
4. **Why This Department Stands Out**: What makes this department notable

Use web search to find the most up-to-date information from the university's official website and faculty pages.
Format the response using markdown with headers and bullet points for readability.`;

    return this.research(query);
  }

  async compareSchools(schools: string[]): Promise<ResearchResponse> {
    const query = `Compare these schools: ${schools.join(', ')}. 
Create a comparison covering:
- Location and setting
- Size and student body
- Admissions competitiveness
- Cost
- Academic strengths
- Campus culture`;

    return this.research(query);
  }

  private async callAPI(messages: Message[]): Promise<string> {
    const { provider, apiKey, model } = this.settings!;

    switch (provider) {
      case 'openai':
        return this.callOpenAI(messages, apiKey, model);
      case 'gemini':
        return this.callGemini(messages, apiKey, model);
      case 'anthropic':
        return this.callAnthropic(messages, apiKey, model);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async callOpenAI(
    messages: Message[],
    apiKey: string,
    model?: string
  ): Promise<string> {
    const response = await fetch(API_ENDPOINTS.openai, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callGemini(
    messages: Message[],
    apiKey: string,
    model?: string
  ): Promise<string> {
    const modelName = model || 'gemini-1.5-flash';
    const url = `${API_ENDPOINTS.gemini}/${modelName}:generateContent?key=${apiKey}`;

    // Convert messages to Gemini format
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    // Add system instruction
    const systemInstruction = messages.find((m) => m.role === 'system');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: systemInstruction
          ? { parts: [{ text: systemInstruction.content }] }
          : undefined,
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  private async callAnthropic(
    messages: Message[],
    apiKey: string,
    model?: string
  ): Promise<string> {
    const systemMessage = messages.find((m) => m.role === 'system');
    const userMessages = messages.filter((m) => m.role !== 'system');

    const response = await fetch(API_ENDPOINTS.anthropic, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-haiku-latest',
        max_tokens: 4096,
        system: systemMessage?.content,
        messages: userMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  }

  private extractSchools(content: string): School[] {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        return parsed.schools || [];
      }
    } catch {
      // No valid JSON found, that's okay
    }
    return [];
  }

  private cleanContent(content: string): string {
    // Remove the JSON block from the displayed content
    return content.replace(/```json\s*[\s\S]*?```/g, '').trim();
  }
}

export const aiService = new AIService();

