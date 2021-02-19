import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})

export class Functions {

    constructor(
        public snackBar: MatSnackBar,
    ) { }

    snackMessage(message: string, snackbarMsg: string = 'success-snackbar'): any {
        this.snackBar.open(message, 'close', {
            panelClass: [snackbarMsg],
            verticalPosition: 'top',
            horizontalPosition: 'end',
            duration: 5000,
        });
    }
}
