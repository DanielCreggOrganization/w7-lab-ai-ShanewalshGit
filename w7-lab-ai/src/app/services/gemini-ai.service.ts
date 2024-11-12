import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private readonly MODEL_NAME = 'gemini-1.5-flash';
  
  async getImageAsBase64(imageUrl: string): Promise<string> {
    // TODO: Move image conversion code here
    // HINT: Copy the code from your component that:
    // 1. Fetches the image
    // 2. Converts to blob
    // 3. Converts to base64
    // 4. Returns the base64 string
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    const base64String = base64data.split(',')[1];
      return base64String;
    } catch (error) {
      throw new Error('Failed to convert image to base64');
    }
  }

  async generateRecipe(imageBase64: string, prompt: string): Promise<string> {
    try {
      // TODO: Move AI generation code here
      // HINT: Copy the code that:
      // 1. Creates the AI client
      // 2. Gets the model
      // 3. Calls generateContent
      // 4. Returns the response text

      const genAI = new GoogleGenerativeAI(environment.apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { 
              inlineData: { 
                mimeType: 'image/jpeg', 
                data: imageBase64
              } 
            },
            { text: prompt }
          ]
        }]
      });

      return result.response.text();
      
    } catch (error) {
      throw new Error('Failed to generate recipe');
    }
  }
}