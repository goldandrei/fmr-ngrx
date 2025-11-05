import { createFeatureSelector, createSelector } from '@ngrx/store';
import { usersAdapter, UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');
const { selectAll, selectEntities } = usersAdapter.getSelectors(selectUsersState);

export const selectAllUsers = selectAll;
export const selectUsersEntities = selectEntities;
export const selectSelectedUserId = createSelector(selectUsersState, s => s.selectedUserId);

export const selectSelectedUser = createSelector(
    selectUsersEntities,
    selectSelectedUserId,
    (entities, id) => (id != null ? entities[id] ?? null : null)
);