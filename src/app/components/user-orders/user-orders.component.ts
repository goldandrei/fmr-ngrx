import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UsersSelectors from '../../store/users/users.selectors';
import * as OrdersSelectors from '../../store/orders/orders.selectors';
import { OrdersActions } from '../../store/orders/orders.action';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
  <h3>Selected user</h3>

  <ng-container *ngIf="user(); else none">
    <!-- show a loading state until details arrive -->
    <p class="meta" *ngIf="!user()?.details">Loading details…</p>

    <!-- reveal content only after details were fetched -->
    <ng-container *ngIf="user()?.details">
      <p class="meta">Name: <b>{{ user()?.name }}</b></p>
      <p class="meta">Total orders sum: <b>{{ total() }}</b></p>

      <h4>Orders</h4>
      <ul>
        <li *ngFor="let o of orders(); trackBy: trackByOrderId">
          <span>#{{ o.id }} — {{ o.total }}</span>
          <button (click)="remove(o.id)">Delete</button>
        </li>
      </ul>

      <form (ngSubmit)="add()">
        <input type="number" [(ngModel)]="newTotal" name="total" placeholder="Order total" min="1" step="1" />
        <button type="submit" [disabled]="selectedId() == null || !newTotal || newTotal <= 0">Add Order</button>
      </form>
    </ng-container>
  </ng-container>

  <ng-template #none><i class="meta">No user selected</i></ng-template>
`,
  styles: [`
  :host { display:block; }
  h3, h4 { margin: 0 0 8px; }
  .meta { color: var(--muted); }
  ul { margin: 8px 0 12px; padding: 0; list-style: none; }
  li { display:flex; align-items:center; gap:8px; padding:6px 0; }
  form { display:grid; grid-template-columns: 1fr auto; gap:8px; }
  input[type="number"] {
    padding: 6px 8px; border: 1px solid var(--border); border-radius: 8px;
  }
`]
})
export class UserOrdersComponent {
  private store = inject(Store);

  readonly user = this.store.selectSignal(UsersSelectors.selectSelectedUser);
  readonly selectedId = this.store.selectSignal(UsersSelectors.selectSelectedUserId);
  readonly orders = this.store.selectSignal(OrdersSelectors.selectOrdersForSelectedUser);
  readonly total = this.store.selectSignal(OrdersSelectors.selectUserOrdersTotal);

  newTotal = 0;

  add() {
    const userId = this.selectedId();
    if (userId == null || !this.newTotal || this.newTotal <= 0) return;
    const id = Date.now();
    this.store.dispatch(OrdersActions.addOrder({ order: { id, userId, total: Number(this.newTotal) } }));
    this.newTotal = 0;
  }
  remove(orderId: number) {
    this.store.dispatch(OrdersActions.deleteOrder({ orderId }));
  }
  trackByOrderId(_: number, o: { id: number }) { return o.id; }
}