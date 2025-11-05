import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UsersActions } from './store/users/users.actions';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UsersListComponent, UserOrdersComponent],
  template: `
    <div class="container">
      <h2>NgRx + Signals Demo</h2>
      <div class="app-grid">
        <section class="card"><app-users-list /></section>
        <section class="card"><app-user-orders /></section>
      </div>
    </div>
  `,
})
export class AppComponent {
  private store = inject(Store);
  constructor() {
    this.store.dispatch(UsersActions.loadUsers());
  }
}