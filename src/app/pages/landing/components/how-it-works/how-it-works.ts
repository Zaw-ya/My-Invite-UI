import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';

interface JourneyStep {
  titleKey: string;
  bodyKey: string;
  icon: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [LucideAngularModule, TranslocoModule],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css'
})
export class HowItWorksComponent {
  steps: JourneyStep[] = [
    { titleKey: 'howItWorks.step1Title', bodyKey: 'howItWorks.step1Body', icon: 'message-circle' },
    { titleKey: 'howItWorks.step2Title', bodyKey: 'howItWorks.step2Body', icon: 'palette' },
    { titleKey: 'howItWorks.step3Title', bodyKey: 'howItWorks.step3Body', icon: 'check-check' },
    { titleKey: 'howItWorks.step4Title', bodyKey: 'howItWorks.step4Body', icon: 'send' },
    { titleKey: 'howItWorks.step5Title', bodyKey: 'howItWorks.step5Body', icon: 'heart-handshake' },
  ];
}
