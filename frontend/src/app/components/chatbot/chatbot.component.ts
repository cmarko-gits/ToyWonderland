import { Component, ChangeDetectorRef, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, NgZone } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToyService } from '../../core/services/toy/toy.service';

interface Message {
  from: 'bot' | 'user';
  text: string | SafeHtml;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatBody') chatBody!: ElementRef;

  opened = false;
  input = '';
  isDarkMode = false;
  isBotTyping = false;
  
  messages: Message[] = [
    { from: 'bot', text: 'Zdravo! Ja sam Toyo 🤖. Kako ti mogu pomoći danas?' }
  ];

  categoryMap: any = {
    'puzzle': 'puzzle', 'slikovnice': 'picture book', 'knjige': 'picture book',
    'figure': 'figure', 'figurice': 'figure', 'karakteri': 'character',
    'vozila': 'vehicles', 'autići': 'vehicles', 'plišane': 'pleated', 'ostalo': 'other'
  };

  private currentFilters: any = {};

  constructor(
    private toyService: ToyService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedMode = localStorage.getItem('chatMode');
      this.isDarkMode = savedMode === 'dark';
    }
  }

  toggle() { 
    this.opened = !this.opened; 
    if (this.opened) {
      this.scrollToBottom();
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('chatMode', this.isDarkMode ? 'dark' : 'light');
    }
  }

  handleChatClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('bot-link')) {
      const toyId = target.getAttribute('data-id');
      if (toyId) this.zone.run(() => this.router.navigate(['/toy', toyId]));
    }
    if (target.classList.contains('bot-link-all')) {
      this.zone.run(() => this.router.navigate(['/toys'], { queryParams: this.currentFilters }));
    }
  }

  send() {
    if (!this.input.trim()) return;
    const userText = this.input.trim();
    
    this.zone.run(() => {
      this.messages = [...this.messages, { from: 'user', text: userText }];
      this.input = '';
      this.isBotTyping = true;
      this.cdr.detectChanges();
      this.scrollToBottom();
    });

    setTimeout(() => {
      this.processCommand(userText.toLowerCase());
    }, 500);
  }

  private processCommand(text: string) {
    const sanitizedText = text.replace(/[.*+?^${}()|[\]\\]/g, '').trim();

    if (sanitizedText.includes('omiljen') || sanitizedText.includes('favorites')) {
      this.isBotTyping = false;
      this.addBotMessage('Odmah te prebacujem na tvoje omiljene igračke! ❤️', true);
      return setTimeout(() => this.zone.run(() => this.router.navigate(['/favorites'])), 1000);
    }
    
    if (sanitizedText.includes('pocetn') || sanitizedText.includes('početn')) {
       this.isBotTyping = false;
       this.addBotMessage('Vraćam te na početnu stranu... 🏠', true);
       return setTimeout(() => this.zone.run(() => this.router.navigate(['/'])), 1000);
    }

    if (sanitizedText.includes('sve igracke') || sanitizedText.includes('sve igračke') || sanitizedText.includes('sve kategorije')) {
      this.currentFilters = {};
      return this.executeSearch({});
    }

    if (['zdravo', 'ćao', 'cao', 'pozdrav', 'dobar dan'].some(p => sanitizedText.includes(p))) {
      this.isBotTyping = false;
      return this.addBotMessage('Zdravo! Drago mi je što se vidimo. Kako ti mogu pomoći u potrazi?', true);
    }

    let params: any = {};
    const matches = sanitizedText.match(/\d+/g);
    const numbers = matches ? matches.map(Number) : null;

    if (numbers && numbers.length > 0) {
      if (sanitizedText.includes('od') && sanitizedText.includes('do') && numbers.length >= 2) {
        if (sanitizedText.includes('godin') || sanitizedText.includes('uzrast')) {
          params.minAge = numbers[0]; params.maxAge = numbers[1];
        } else {
          params.minPrice = numbers[0]; params.maxPrice = numbers[1];
        }
      } else if (sanitizedText.includes('od') || sanitizedText.includes('iznad')) {
        if (sanitizedText.includes('godin')) params.minAge = numbers[0];
        else params.minPrice = numbers[0];
      } else if (sanitizedText.includes('do') || sanitizedText.includes('ispod')) {
        if (sanitizedText.includes('godin')) params.maxAge = numbers[0];
        else params.maxPrice = numbers[0];
      }
    }

    if (sanitizedText.includes('skuplje')) params.sort = 'price_desc';
    else if (sanitizedText.includes('jeftinije')) params.sort = 'price_asc';

    for (const key in this.categoryMap) {
      if (sanitizedText.includes(key)) {
        params.category = this.categoryMap[key];
        break;
      }
    }

    if (sanitizedText.includes('devojcic')) params.targetGroup = 'devojčica';
    else if (sanitizedText.includes('decak')) params.targetGroup = 'dečak';

    if (Object.keys(params).length === 0) {
      params.search = sanitizedText;
    }

    this.currentFilters = params;
    this.executeSearch(params);
  }

  private executeSearch(filters: any) {
    const params = { page: 1, limit: 5, ...filters };

    this.toyService.getToys(params).subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          this.isBotTyping = false;
          const toys = response.items || [];
          if (toys.length > 0) {
            let htmlString = `🔍 <b>Pronašao sam (${response.totalItems}):</b><br><br>`;
            toys.forEach((t: any) => {
              htmlString += `
                <div style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                  <b>🧸 ${t.name}</b><br>
                  💰 Cena: <span style="color: #2ecc71; font-weight: bold;">${t.price}$</span><br>
                  <a class="bot-link" data-id="${t._id}" style="cursor: pointer; text-decoration: underline; color: #1976d2;">POGLEDAJ I REZERVIŠI</a>
                </div>`;
            });
            htmlString += `
              <div style="text-align: center; margin-top: 10px;">
                <a class="bot-link-all" style="cursor: pointer; font-weight: bold; color: #1976d2;">👉 VIDI SVE REZULTATE</a>
              </div>`;
            this.addBotMessage(this.sanitizer.bypassSecurityTrustHtml(htmlString), true);
          } else {
            this.addBotMessage('Nažalost, nisam pronašao ništa što odgovara tvojoj pretrazi.', true);
          }
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isBotTyping = false;
          this.addBotMessage('Došlo je do greške pri pretrazi.', true);
        });
      }
    });
  }

  private addBotMessage(text: string | SafeHtml, immediate: boolean = false) {
    const pushMessage = () => {
      this.zone.run(() => {
        this.messages = [...this.messages, { from: 'bot', text }];
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        this.scrollToBottom();
      });
    };
    if (immediate) pushMessage();
    else setTimeout(pushMessage, 300);
  }

  private scrollToBottom() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.chatBody) {
          const el = this.chatBody.nativeElement;
          el.scrollTop = el.scrollHeight;
          this.cdr.detectChanges();
        }
      }, 50);
    }
  }
}