import { classifyText as classifyAI } from '../services/aiService.js'; //here i import the ai service


// this function handles the classification request
export const classifyText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await classifyAI(text.trim());

    res.json({
      success: true,
      data: {
        text,
        category: result.category,
        confidence: result.confidence,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};
