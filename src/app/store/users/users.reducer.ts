import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { User } from '../../models';
import { UsersActions } from './users.actions';

export interface UsersState extends EntityState<User> {
    selectedUserId: number | null;
    lastDetailsUserId: number | null;
}

export const usersAdapter = createEntityAdapter<User>();

const initialState: UsersState = usersAdapter.getInitialState({
    selectedUserId: null,
    lastDetailsUserId: null,
});

export const usersReducer = createReducer(
    initialState,
    on(UsersActions.loadUsersSuccess, (state, { users }) => usersAdapter.setAll(users, state)),

    // Add-or-update (prevents duplicates by id)
    on(UsersActions.addUser, (state, { user }) => usersAdapter.upsertOne(user, state)),

    // Merge changes on update
    on(UsersActions.updateUser, (state, { user }) =>
        usersAdapter.updateOne({ id: user.id, changes: user }, state)
    ),

    on(UsersActions.deleteUser, (state, { userId }) => usersAdapter.removeOne(userId, state)),
    on(UsersActions.selectUser, (state, { userId }) => {
        // set selection
        let s = { ...state, selectedUserId: userId };

        // force re-fetch UX: hide any cached details for the selected user
        if (userId != null) {
            s = usersAdapter.updateOne(
                { id: userId, changes: { details: undefined } },
                s
            );
        }

        return s;
    }),

    on(UsersActions.loadUserDetailsSuccess, (state, { userId, details }) => {
        let s = state;

        // clear previous “details” so only the last fetched user keeps it
        if (s.lastDetailsUserId != null && s.lastDetailsUserId !== userId) {
            s = usersAdapter.updateOne(
                { id: s.lastDetailsUserId, changes: { details: undefined } },
                s
            );
        }

        // set details for the current user and remember it as last
        s = usersAdapter.updateOne({ id: userId, changes: { details } }, s);
        return { ...s, lastDetailsUserId: userId };
    }),
);