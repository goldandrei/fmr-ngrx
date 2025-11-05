import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersActions } from './users.actions';
import { UserService } from '../../services/user.service';
import { EMPTY } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

@Injectable()
export class UsersEffects {
    private actions$ = inject(Actions);
    private api = inject(UserService);

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.loadUsers),
            switchMap(() =>
                this.api.getUsers().pipe(
                    map(users => UsersActions.loadUsersSuccess({ users })),
                    catchError(() => EMPTY)
                )
            )
        )
    );

    // React to selection; cancel previous request on new selection
    selectedUserDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.selectUser),
            map(({ userId }) => userId),
            filter((id): id is number => id != null),
            distinctUntilChanged(),
            switchMap(userId =>
                this.api.getUserDetails(userId).pipe(
                    map(res => UsersActions.loadUserDetailsSuccess({ userId, details: res.details })),
                    catchError(() => EMPTY)
                )
            )
        )
    );
}