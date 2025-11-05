import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { usersFeature } from './app/store/users/users.feature';
import { ordersFeature } from './app/store/orders/orders.feature';
import { UsersEffects } from './app/store/users/users.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideStore(),
    provideState(usersFeature),
    provideState(ordersFeature),
    provideEffects([UsersEffects]),
    provideStoreDevtools(),
  ],
}).catch(err => console.error(err));