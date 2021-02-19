
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AppService {

    private menubackicon = new BehaviorSubject('');
    updateMenuBackIcon = this.menubackicon.asObservable();

    constructor() { }

    /**
     * This function is called for update header on login
     * @param icon true / false
     */
    updateIcons(data: any): void {
        this.menubackicon.next(data);
    }
}
