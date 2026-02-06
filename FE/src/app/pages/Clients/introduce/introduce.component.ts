import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-introduce',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './introduce.component.html',
  styleUrl: './introduce.component.scss'
})
export class IntroduceComponent {
  isNewsExpanded: boolean = false;

  toggleNews(event: Event): void {
    event.preventDefault();
    this.isNewsExpanded = !this.isNewsExpanded;
  }
}
