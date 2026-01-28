import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { SHARED_MODULES } from '../../../../shared/shared.module';

@Component({
  selector: 'app-recapcha-demo',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './recapcha-demo.component.html',
  styleUrl: './recapcha-demo.component.scss',
})
export class RecapchaDemoComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Output() resolved = new EventEmitter<string>(); // emits a fake token when solved
  @Input() isVerify = false;

  answer = ''; // real answer (kept in FE for demo)
  userInput = '';
  lastToken = '';

  // config
  length = 6;
  width = 500;
  height = 80;
  fontBase = 36;

  ngOnInit(): void {
    this.generate();
  }

  ngOnChanges(): void {
    this.verify();
  }

  generate() {
    this.answer = this.randomText(this.length);
    this.drawCaptcha(this.answer);
    this.userInput = '';
    this.lastToken = ''; // reset

  }
  onBlur() {
    if (!this.userInput) {
      this.resolved.emit('');
      return;
    }
    this.verify();
  }

  verify() {
    if (this.userInput?.trim() === this.answer) {
      this.lastToken = btoa(
        `${this.answer}:${Math.random().toString(36).slice(2, 10)}`
      );
      this.resolved.emit(this.lastToken);
      return true;
    } else {
      this.shakeCanvas();
      this.resolved.emit('');
      return false;
    }
  }

  getToken() {
    return this.lastToken;
  }

  private drawCaptcha(text: string) {
    const canvas = this.canvas.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d')!;
    // background gradient
    const g = ctx.createLinearGradient(0, 0, this.width, this.height);
    g.addColorStop(0, '#f3f4f6');
    g.addColorStop(1, '#fff');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.width, this.height);

    // add noisy background dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = this.randomColor(120, 220, 0.15);
      const r = Math.random() * 4 + 1;
      ctx.beginPath();
      ctx.arc(
        Math.random() * this.width,
        Math.random() * this.height,
        r,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // draw warped chars
    const charSpace = this.width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const fontSize = this.fontBase + Math.floor(Math.random() * 8) - 4;
      ctx.font = `${fontSize}px "Segoe UI", Roboto, Arial`;
      ctx.textBaseline = 'middle';

      // random position jitter
      const x = charSpace * (i + 0.7) + (Math.random() * 8 - 4);
      const y = this.height / 2 + (Math.random() * 12 - 6);

      // save + transform for rotation/skew
      ctx.save();
      const angle = (Math.random() * 40 - 20) * (Math.PI / 180); // -20..20 deg
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.transform(
        1,
        Math.random() * 0.3 - 0.15,
        Math.random() * 0.3 - 0.15,
        1,
        0,
        0
      );

      // colored fill + stroke
      ctx.fillStyle = this.randomColor(40, 120);
      ctx.strokeStyle = this.randomColor(10, 80);
      ctx.lineWidth = 1;
      ctx.fillText(ch, -fontSize / 2, 0);
      ctx.strokeText(ch, -fontSize / 2, 0);

      ctx.restore();
    }

    // add crossing lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = this.randomColor(60, 190, 0.15);
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * this.width, Math.random() * this.height);
      ctx.bezierCurveTo(
        Math.random() * this.width,
        Math.random() * this.height,
        Math.random() * this.width,
        Math.random() * this.height,
        Math.random() * this.width,
        Math.random() * this.height
      );
      ctx.stroke();
    }

    // mild blur effect using globalAlpha + repeated draw (cheap)
    ctx.globalAlpha = 0.97;
    ctx.fillStyle = 'rgba(255,255,255,0.01)';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.globalAlpha = 1;
  }

  private randomText(len: number) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'; // avoid 0/O, l/1 confusion
    let s = '';
    for (let i = 0; i < len; i++)
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  }

  private randomColor(min = 0, max = 255, alpha = 1) {
    const r = Math.floor(Math.random() * (max - min) + min);
    const g = Math.floor(Math.random() * (max - min) + min);
    const b = Math.floor(Math.random() * (max - min) + min);
    if (alpha >= 1) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private shakeCanvas() {
    const el = this.canvas.nativeElement;
    console.log('🚀 This is! __ el:', el);
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 420);
  }
}
