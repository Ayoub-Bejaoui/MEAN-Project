import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import {  AuthModule } from './auth/auth.module';


const routes: Routes = [
  // { path: '**', component: PathNotFoundComponent },
  { path: '',  component: PostListComponent },
  { path: 'create',  component: PostCreateComponent, canActivate: [AuthGuardService] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuardService] },
  { path: 'auth', loadChildren: () => AuthModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
