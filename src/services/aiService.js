import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const CATEGORIES = ['Complaint', 'Query', 'Feedback', 'Other'];


// this function handles all the ai service logic ussing groq api (lamma model)
export const classifyText = async (text) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a text classification expert. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: `Classify the following text into exactly one of these categories: Complaint, Query, Feedback, or Other.

Rules:
- Complaint: Expressions of dissatisfaction, problems, or negative experiences
- Query: Questions, requests for information, or clarifications
- Feedback: Suggestions, opinions, praise, or general comments
- Other: Anything that doesn't fit the above categories

Respond in this exact JSON format only, with no additional text:
{"category": "CategoryName", "reasoning": "brief explanation"}

Text to classify: "${text}"`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_completion_tokens: 256,
      top_p: 1,
      stream: false
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const category = parsed.category;

    if (!CATEGORIES.includes(category)) {
      throw new Error('Invalid category returned by AI');
    }

    const confidence = calculateConfidence(text, category, parsed.reasoning);

    return {
      category,
      confidence
    };
  } catch (error) {
    if (error.status === 401) {
      throw new Error('Invalid API key configuration');
    }
    console.error('AI Service Error:', error.message);
    throw new Error('Classification service temporarily unavailable');
  }
};

// this function calculates confidence score 
const calculateConfidence = (text, category, reasoning) => {
  let confidence = 0.75;

  if (reasoning && reasoning.length > 20) {
    confidence += 0.1;
  }

  const wordCount = text.split(/\s+/).length;
  if (wordCount > 10) {
    confidence += 0.05;
  }

  const keywords = {
    Complaint: ['bad', 'terrible', 'poor', 'disappointed', 'unsatisfied', 'issue', 'problem', 'not happy', 'worst', 'hate'],
    Query: ['how', 'what', 'when', 'where', 'why', 'can you', 'could you', 'please tell', '?'],
    Feedback: ['suggest', 'recommend', 'good', 'great', 'excellent', 'love', 'like', 'appreciate', 'helpful'],
    Other: []
  };

  const lowerText = text.toLowerCase();
  const categoryKeywords = keywords[category] || [];
  const matchCount = categoryKeywords.filter(kw => lowerText.includes(kw)).length;

  if (matchCount > 0) {
    confidence += Math.min(matchCount * 0.03, 0.1);
  }

  return Math.min(Math.round(confidence * 100) / 100, 0.99);
};
