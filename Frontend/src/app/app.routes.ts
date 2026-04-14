import { Routes } from '@angular/router';
import { LoginComponent } from '../Components/login/login';
import { DashboardComponent } from '../Components/dashboard/dashboard';
import { HomeComponent } from '../Components/dashboard/content/home/home';
import { StoreComponent } from '../Components/dashboard/content/stores/stores';
import { ProductsComponent } from '../Components/dashboard/content/products/products';
import { ChatbotComponent } from '../Components/dashboard/content/chatbot/chatbot';
import { CategoryProductsComponent } from '../Components/dashboard/content/category-products/category-products';
import { DetailedProductCardComponent } from '../Components/dashboard/content/products/detailed-product-card/detailed-product-card';
import { authGuard } from '../Services/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'stores', component: StoreComponent },
      { path: 'store-products/:id', component: ProductsComponent, data: { mode: 'store' } },
      {
        path: 'products',
        component: CategoryProductsComponent,
        children: [
          { path: '', redirectTo: 'category/1', pathMatch: 'full' },
          { path: 'category/:id', component: ProductsComponent, data: { mode: 'category' }}
        ]
      },
      { path: 'product/:id', component: DetailedProductCardComponent},
      { path: 'chatbot', component: ChatbotComponent }
    ]
  },
  { path: '', redirectTo: 'dashboard/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard/home' }
];
