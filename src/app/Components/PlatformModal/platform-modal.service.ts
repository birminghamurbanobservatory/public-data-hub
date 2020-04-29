import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlatformModalService {

    private observationSource = new Subject();
    public observation = this.observationSource.asObservable();

    /**
     * Emits an observation id
     * 
     * @param id : id of an observation
     */
    public observationSelected(id: string) {
        this.observationSource.next(id);
    }
}