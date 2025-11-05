import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { User } from '../../models';

export const UsersActions = createActionGroup({
    source: 'Users',
    events: {
        'Load Users': emptyProps(),
        'Load Users Success': props<{ users: User[] }>(),
        'Select User': props<{ userId: number | null }>(),
        'Add User': props<{ user: User }>(),
        'Update User': props<{ user: User }>(),
        'Delete User': props<{ userId: number }>(),
        'Load User Details Success': props<{ userId: number; details: string }>(),
    },
});