import { Component, OnInit } from '@angular/core';
import { PlatformService } from 'src/app/platform/platform.service';

@Component({
    selector: 'buo-home-page',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    public zoom = 13;
    public center = { lat: 52.480100, lng: -1.896478 };

    constructor(private platforms: PlatformService) { }

    ngOnInit(): void {

        this.platforms.getPlatforms({ isHostedBy: { exists: false } })
            .subscribe((data) => console.log(data));
    }
}
