import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    getUsers(): Observable<User[]> {
        const data: User[] = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Carol' },
        ];
        return of(data).pipe(delay(400));
    }
    getUserDetails(userId: number): Observable<{ details: string }> {
        return of({ details: `User id #${userId} details fetched successfully` }).pipe(delay(1000));
    }

}