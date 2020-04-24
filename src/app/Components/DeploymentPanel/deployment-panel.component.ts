import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observation } from 'src/app/observation/observation.class';
import * as moment from 'moment';

@Component({
    selector: 'buo-deployment-panel',
    templateUrl: './deployment-panel.component.html',
})
export class DeploymentPanelComponent {

    // the selected platform information
    @Input() platform;

    @Input() observations: Observation[];

    @Output() showModal: EventEmitter<any> = new EventEmitter();

    public resultTime(time) {
        return moment(time).fromNow();
    }

    public  showPlatform(obs) {
        this.showModal.emit(obs);
    }

}