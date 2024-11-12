import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
         IonGrid, IonRow, IonCol, IonCard, IonCardContent, 
         IonCardHeader, IonCardTitle, IonItem, IonLabel, 
         IonButton, IonIcon, IonProgressBar, IonText,
         IonRadioGroup, IonRadio, IonImg, IonTextarea,
         IonRippleEffect } from '@ionic/angular/standalone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';
import { GeminiAiService } from '../services/gemini-ai.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    // TODO: Add all the Ionic components from the imports above
    // HINT: Copy each component name from the imports list
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonButton, IonIcon, IonProgressBar, IonText, IonRadioGroup, IonRadio, IonImg, IonTextarea, IonRippleEffect,
    CommonModule, 
    FormsModule,
    // YOUR CODE HERE
  ]
})
export class HomePage {
  // TODO: Add default prompt
  // HINT: Something like "Provide a recipe for these baked goods"
  prompt = 'Provide a recipe for these baked goods'; 
  output = '';
  isLoading = false;

  availableImages = [
    { url: 'assets/images/baked_goods_1.jpg', label: 'Baked Good 1' },
    { url: 'assets/images/baked_goods_2.jpg', label: 'Baked Good 2' },
    { url: 'assets/images/baked_goods_3.jpg', label: 'Baked Good 3' }
  ];

  selectedImage = this.availableImages[0].url;

  get formattedOutput() {
    return this.output.replace(/\n/g, '<br>');
  }

  selectImage(url: string) {
    // TODO: Set the selectedImage property
    // HINT: this.selectedImage = url;
    this.selectedImage = url;
  }


  constructor(private geminiService: GeminiAiService) {}

  async onSubmit() {
    if (this.isLoading) return;
    this.isLoading = true;
    
    try {
      const response = await fetch(this.selectedImage);
      const blob = await response.blob();
      const base64data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const base64String = base64data.split(',')[1];
  
      // TODO: Add Gemini AI code here
      // HINT: Follow these steps:
      // 1. Create the AI client
      // 2. Get the model
      // 3. Call generateContent
      // 4. Update this.output

      const base64Image = await this.geminiService.getImageAsBase64(this.selectedImage);
      this.output = await this.geminiService.generateRecipe(base64Image, this.prompt);
      
    } catch (e) {
      this.output = `Error: ${e instanceof Error ? e.message : 'Something went wrong'}`;
    }
    
    this.isLoading = false;
  }

  async copyRecipe() {
    try {
      // Remove HTML line breaks before copying
      const plainText = this.output.replace(/<br>/g, '\n');
      await navigator.clipboard.writeText(plainText);
      // copy to local storage
      localStorage.setItem('recipe', plainText);
    } catch (err) {
      console.error('Failed to copy recipe:', err);
    }
  }
}