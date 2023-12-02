import { Component, OnInit } from '@angular/core';
import { IonContent, IonText, IonButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonContent, IonText, IonButton, IonContent, IonText],
})
export class HomePage implements OnInit {
    constructor() {

    }

    ngOnInit(): void {
        if (window.location.search.includes('?app')) {
            var ua = navigator.userAgent.toLowerCase();
            var isAndroid = ua.indexOf("android") > -1;
            var isiOS = ua.indexOf("iphone") > -1;
            if (isAndroid) {
                window.location.href = "https://play.google.com/store/apps/details?id=nexus.concepts.dust";
            }
            if (isiOS) {
                window.location.href = "https://apps.apple.com/us/app/dust-a-guide-for-burners/id6456943178";
            }
        }
    }
}
