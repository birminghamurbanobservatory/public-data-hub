import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'buo-observation-loading-modal',
    templateUrl: './loading-modal.component.html'
})
export class ObservationLoadingModalComponent {

    @Input() showModal: Boolean;
    @Input() obsTally: Number;
    @Output() cancelled: EventEmitter<Boolean> = new EventEmitter();

    public notCancelled: Boolean = true;

    public cancel() {
        this.notCancelled = false;
        this.cancelled.emit(false);
    }
}