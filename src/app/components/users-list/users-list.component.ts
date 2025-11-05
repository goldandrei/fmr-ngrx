import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UsersSelectors from '../../store/users/users.selectors';
import { UsersActions } from '../../store/users/users.actions';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Users</h3>
    <ul>
      <li *ngFor="let u of users(); trackBy: trackById"
          [class.sel]="u.id === selectedId()"
          (click)="select(u.id)">
        {{ u.name }} <small *ngIf="u.details">({{u.details}})</small>
      </li>
    </ul>

    <hr />
    <h4>Manage user</h4>

    <div *ngIf="msg" class="msg" [class.success]="msgType==='success'"
                         [class.warn]="msgType==='warn'"
                         [class.error]="msgType==='error'"
                         aria-live="polite">
      {{ msg }}
    </div>

    <form (ngSubmit)="save()">
      <label for="user-id">ID</label>
      <input id="user-id" type="number" [(ngModel)]="formId" name="id" min="1" />

      <label for="user-name">User name</label>
      <input id="user-name" type="text" [(ngModel)]="formName" name="name" />

      <button type="submit" [disabled]="!valid()">Save</button>
      <button type="button" (click)="remove()" [disabled]="!formId">Delete</button>
      <button type="button" (click)="reset()">Clear</button>
    </form>
  `,
  styles: [`
    :host { display:block; }
    ul { margin:0; padding:0; list-style:none; }
    li { padding:8px 10px; border-radius:8px; cursor:pointer; }
    li:hover { background:#f1f5f9; }
    .sel { background: var(--accent-100); border:1px solid #bfdbfe; }
    form { display:grid; grid-template-columns: max-content 1fr; gap:8px 12px; margin-top:8px; align-items:center; }
    input { padding:6px 8px; border:1px solid var(--border); border-radius:8px; }
    .msg { margin:6px 0 10px; padding:8px 10px; border-radius:8px; border:1px solid var(--border); background:#fff; }
    .msg.success { border-color:#16a34a33; background:#f0fdf4; }
    .msg.warn { border-color:#f59e0b33; background:#fffbeb; }
    .msg.error { border-color:#ef444433; background:#fef2f2; }
  `]
})
export class UsersListComponent {
  private store = inject(Store);

  readonly users = this.store.selectSignal(UsersSelectors.selectAllUsers);
  readonly entities = this.store.selectSignal(UsersSelectors.selectUsersEntities);
  readonly selectedId = this.store.selectSignal(UsersSelectors.selectSelectedUserId);

  formId: number | null = null;
  formName = '';

  msg = '';
  msgType: 'success' | 'warn' | 'error' | 'info' = 'info';

  private setMsg(text: string, type: UsersListComponent['msgType'] = 'info') {
    this.msg = text; this.msgType = type;
  }

  select(id: number) {
    this.store.dispatch(UsersActions.selectUser({ userId: id }));
    const u = this.entities()[id];
    this.formId = id;
    this.formName = u?.name ?? '';
    this.setMsg(`Editing user #${id}`, 'info');
  }

  valid() { return !!this.formId && !!String(this.formName).trim(); }
  reset() { this.formId = null; this.formName = ''; this.setMsg(''); }

  save() {
    if (!this.valid()) return;
    const id = Number(this.formId);
    const name = String(this.formName).trim();
    const current = this.entities()[id];

    if (current) {
      if (current.name !== name) {
        const ok = window.confirm(`User #${id} exists as "${current.name}". Update name to "${name}"?`);
        if (!ok) { this.setMsg('Update cancelled', 'warn'); return; }
      }
      this.store.dispatch(UsersActions.updateUser({ user: { id, name } }));
      this.setMsg(`Updated user #${id}`, 'success');
    } else {
      this.store.dispatch(UsersActions.addUser({ user: { id, name } }));
      this.setMsg(`Added user #${id}`, 'success');
    }
    this.store.dispatch(UsersActions.selectUser({ userId: id }));
  }

  remove() {
    if (this.formId == null) return;
    const id = Number(this.formId);
    const exists = !!this.entities()[id];
    if (!exists) {
      this.setMsg(`User #${id} does not exist`, 'warn');
      return; // don't clear fields or selection on no-op delete
    }
    const ok = window.confirm(`Delete user #${id}?`);
    if (!ok) { this.setMsg('Delete cancelled', 'warn'); return; }

    this.store.dispatch(UsersActions.deleteUser({ userId: id }));
    // Clear selection only if we deleted the selected user
    if (this.selectedId() === id) {
      this.store.dispatch(UsersActions.selectUser({ userId: null }));
    }
    this.reset();
    this.setMsg(`Deleted user #${id}`, 'success');
  }

  trackById(_: number, u: { id: number }) { return u.id; }
}