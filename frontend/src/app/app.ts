import { Component, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/user-header.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ChatbotComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('ToyWonderland Frontend');
  private platformId = inject(PLATFORM_ID); // Ubacujemo ID platforme

  // Signal inicijalizujemo na false, a vrednost ćemo pročitati u konstruktoru
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Proveravamo da li smo u browseru pre čitanja localStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode.set(savedTheme === 'dark');
    }

    // Effect koji prati promenu signala i menja temu
    effect(() => {
      const mode = this.isDarkMode();
      
      // Opet provera za browser jer effect može da se okine i na serveru
      if (isPlatformBrowser(this.platformId)) {
        if (mode) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
        }
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
  }
}