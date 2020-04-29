import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observation } from 'src/app/observation/observation.class';
import * as moment from 'moment';
import { PlatformModalService } from '../PlatformModal/platform-modal.service';

@Component({
    selector: 'buo-deployment-panel',
    templateUrl: './deployment-panel.component.html',
})
export class DeploymentPanelComponent {

    // the selected platform information
    @Input() platform;

    @Input() observations: Observation[];

    @Output() closePanel: EventEmitter<any> = new EventEmitter();


    constructor(
        private platformModalService: PlatformModalService,
    ) {}

    public resultTime(time) {
        return moment(time).fromNow();
    }

    public showPlatform(obs) {
        console.log(obs.id);
        this.platformModalService.observationSelected(obs.id);
    }

}