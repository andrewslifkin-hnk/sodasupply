import OpenAI from 'openai';

export interface AIPersonaBehavior {
  searchTerms?: string[];
  browsingActions: string[];
  productPreferences?: string[];
  decisionFactors: string[];
  sessionDuration: number;
  conversionLikelihood: number;
  interactionStyle: 'quick' | 'thorough' | 'hesitant' | 'confident';
}

export interface PersonaProfile {
  persona_key: string;
  label: string;
  behaviours: {
    session_length: 'short' | 'medium' | 'long';
    pages_common: string[];
    conversion_latency_hours: number;
  };
}

export class AIPersonaService {
  private client: OpenAI;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !!process.env.OPENAI_API_KEY;
    if (this.isEnabled) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.warn('OpenAI API key not found. AI persona generation disabled.');
    }
  }

  async generatePersonaBehavior(persona: PersonaProfile, userIndex: number): Promise<AIPersonaBehavior> {
    if (!this.isEnabled) {
      return this.getFallbackBehavior(persona);
    }

    try {
      const prompt = this.buildPrompt(persona, userIndex);
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are the Eazle Test Lab GPT, an expert in generating realistic e-commerce user behaviors for testing. You generate detailed, varied user behaviors that simulate real shopping patterns."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from OpenAI');
      }

      return this.parseAIResponse(aiResponse, persona);
    } catch (error) {
      console.warn(`AI persona generation failed for user ${userIndex}:`, error);
      return this.getFallbackBehavior(persona);
    }
  }

  private buildPrompt(persona: PersonaProfile, userIndex: number): string {
    return `Generate realistic shopping behavior for a ${persona.label} visiting a beverage e-commerce site (SodaSupply). 

Persona: ${persona.label}
Session Length: ${persona.behaviours.session_length}
User #: ${userIndex}

The site sells beverages like BODYARMOR, Boylan sodas, OLIPOP, energy drinks, etc.

Generate a JSON response with these fields:
{
  "searchTerms": ["array", "of", "search", "terms"],
  "browsingActions": ["array", "of", "browsing", "behaviors"],
  "productPreferences": ["types", "of", "products", "they", "prefer"],
  "decisionFactors": ["what", "influences", "their", "purchase"],
  "sessionDuration": number_in_seconds,
  "conversionLikelihood": decimal_between_0_and_1,
  "interactionStyle": "quick|thorough|hesitant|confident"
}

Make this user unique - vary their preferences, search terms, and behaviors. Consider their persona type but add realistic variation.`;
  }

  private parseAIResponse(response: string, persona: PersonaProfile): AIPersonaBehavior {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and fill in defaults
      return {
        searchTerms: Array.isArray(parsed.searchTerms) ? parsed.searchTerms : [],
        browsingActions: Array.isArray(parsed.browsingActions) ? parsed.browsingActions : ['browse products'],
        productPreferences: Array.isArray(parsed.productPreferences) ? parsed.productPreferences : [],
        decisionFactors: Array.isArray(parsed.decisionFactors) ? parsed.decisionFactors : ['price'],
        sessionDuration: typeof parsed.sessionDuration === 'number' ? parsed.sessionDuration : this.getDefaultDuration(persona),
        conversionLikelihood: typeof parsed.conversionLikelihood === 'number' ? parsed.conversionLikelihood : 0.5,
        interactionStyle: ['quick', 'thorough', 'hesitant', 'confident'].includes(parsed.interactionStyle) 
          ? parsed.interactionStyle 
          : 'quick'
      };
    } catch (error) {
      console.warn('Failed to parse AI response:', error);
      return this.getFallbackBehavior(persona);
    }
  }

  private getFallbackBehavior(persona: PersonaProfile): AIPersonaBehavior {
    const baseActions = ['browse products', 'view product details', 'check prices'];
    const sessionDuration = this.getDefaultDuration(persona);
    
    return {
      searchTerms: ['energy drink', 'soda', 'beverage'],
      browsingActions: baseActions,
      productPreferences: ['popular brands', 'good value'],
      decisionFactors: ['price', 'brand reputation'],
      sessionDuration,
      conversionLikelihood: persona.persona_key === 'fast' ? 0.7 : persona.persona_key === 'deliberate' ? 0.5 : 0.3,
      interactionStyle: persona.persona_key === 'fast' ? 'quick' : persona.persona_key === 'deliberate' ? 'thorough' : 'hesitant'
    };
  }

  private getDefaultDuration(persona: PersonaProfile): number {
    switch (persona.behaviours.session_length) {
      case 'short': return 30;
      case 'medium': return 120;
      case 'long': return 300;
      default: return 60;
    }
  }
}
