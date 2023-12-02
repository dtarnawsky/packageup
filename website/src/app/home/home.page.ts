import { Component, OnInit } from '@angular/core';
import { IonContent, IonText, IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { logoGithub, copyOutline } from 'ionicons/icons';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonContent, IonText, IonButton, IonContent, IonText, IonIcon],
})
export class HomePage implements OnInit {
    constructor() {
        addIcons({ logoGithub, copyOutline });
    }

    ngOnInit(): void {
    }

    copy() {
        const copyText: any = document.getElementById("cmd");
        if (!copyText) return;
        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);
    }
}
