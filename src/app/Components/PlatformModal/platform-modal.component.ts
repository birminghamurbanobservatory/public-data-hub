import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Platform } from 'src/app/platform/platform.class';

@Component({
    selector: 'buo-platform-modal',
    templateUrl: './platform-modal.component.html',
})
export class PlatformModalComponent {

    @Input() show: Boolean = false;

    @Input() platform: Platform;

    @Output() close: EventEmitter<any> = new EventEmitter();

    public closeModal() {
        this.close.emit();
    }

    @HostListener('document:keyup', ['$event'])
    handleEscKeyPress(event: KeyboardEvent) {
        if (event.keyCode !== 27) return;
     
        event.stopImmediatePropagation();
          
        this.closeModal();
    }

}