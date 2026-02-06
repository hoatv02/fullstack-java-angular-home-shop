import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
    label: string;
    routerLink?: string;
}

@Component({
    selector: 'app-client-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './client-breadcrumb.component.html',
    styleUrl: './client-breadcrumb.component.scss'
})
export class ClientBreadcrumbComponent {
    @Input() items: BreadcrumbItem[] = [];
}
