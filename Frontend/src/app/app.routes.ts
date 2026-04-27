import { Routes } from '@angular/router';
import { LoginComponent } from '../Components/login/login';
import { SignInComponent } from '../Components/login/sign-in/sign-in';
import { DashboardComponent } from '../Components/dashboard/dashboard';
import { HomeComponent } from '../Components/dashboard/content/home/home';
import { StoreComponent } from '../Components/dashboard/content/stores/stores';
import { ProfileComponent } from '../Components/dashboard/content/profile/profile';
import { SettingsComponent } from '../Components/dashboard/content/settings/settings';
import { ProductsComponent } from '../Components/dashboard/content/products/products';
import { ChatbotComponent } from '../Components/dashboard/content/chatbot/chatbot';
import { CategoryProductsComponent } from '../Components/dashboard/content/category-products/category-products';
import { DetailedProductCardComponent } from '../Components/dashboard/content/products/detailed-product-card/detailed-product-card';
import { AnalyticsComponent } from '../Components/dashboard/content/analytics/analytics';
import { authGuard } from '../Services/auth-guard';
import { storeGuard } from '../Services/store-guard';
import { CheckoutComponent } from '../Components/dashboard/content/checkout/checkout';
import { ReviewPageComponent } from '../Components/dashboard/content/products/review-page/review-page';
import { corporateGuard } from '../Services/corporate-guard';
import { ReviewManagementComponent } from '../Components/dashboard/content/review-management/review-management';
import { UserManagementComponent } from '../Components/dashboard/content/user-management/user-management';
import { adminGuard } from '../Services/admin-guard';
import { OAuthCallbackComponent } from '../Components/oauth/oauth';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'oauth-callback', component: OAuthCallbackComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'review-management', component: ReviewManagementComponent, canActivate: [corporateGuard] },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'user-management', component: UserManagementComponent, canActivate: [adminGuard] },
      { path: 'home', component: HomeComponent },
      { path: 'stores', component: StoreComponent, canActivate: [storeGuard] },
      { path: 'store-products/:id', component: ProductsComponent, data: { mode: 'store' } },
      { path: 'analytics', component: AnalyticsComponent },
      {
        path: 'products',
        component: CategoryProductsComponent,
        children: [
          { path: '', redirectTo: 'category/0', pathMatch: 'full' },
          { path: 'category/:id', component: ProductsComponent, data: { mode: 'category' }}
        ]
      },
      { path: 'product/:id', component: DetailedProductCardComponent},
      { path: 'product/:id/reviews', component: ReviewPageComponent },
      { path: 'chatbot', component: ChatbotComponent }
    ]
  },
  { path: '', redirectTo: 'dashboard/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard/home' }
];
