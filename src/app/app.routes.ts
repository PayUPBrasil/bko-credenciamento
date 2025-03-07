import { Routes } from '@angular/router';
import { AuthGuard } from './services/guards/authGuard.service';
import { PermissionsGuard } from './services/guards/permissionsGuard.service';
import { PagenotfoundComponent } from './components/core/layout/pageNotFound/pagenotfound.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/core/forms/login/loginForm.component').then(m => m.LoginFormComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/core/wrapper/wrapper.component').then(m => m.WrapperComponent),
    children: [

      {
        path: 'home',
        loadComponent: () => import('./components/core/pages/dashboard-pages/home/home.component').then(m => m.HomeComponent)
      },


      {
        path: 'admin',
        canActivateChild: [PermissionsGuard],
        children: [

          {
            path: 'users',
            loadComponent: () => import('./components/core/pages/dashboard-pages/admin/users/users.component').then(m => m.UsersComponent),
            data: { roles: ['admin', 'master', 'Visualizar a lista completa de clientes'] }
          },

          {
            path: 'users/:page',
            loadComponent: () => import('./components/core/pages/dashboard-pages/admin/users/users.component').then(m => m.UsersComponent),
            data: { roles: ['admin', 'master', 'Visualizar a lista completa de clientes'] }
          },
          {
            path: 'create-permissions',
            loadComponent: () => import('./components/core/pages/dashboard-pages/admin/create-permissions/createPermissions.component').then(m => m.CreatePermissionsComponent),
            data: { roles: ['admin', 'master'] }
          },
          {
            path: 'create-user',
            loadComponent: () => import('./components/core/pages/dashboard-pages/admin/users/createNewUser.component').then(m => m.CreateNewUserComponent),
            data: { roles: ['admin', 'master'] }
          },
          {
            path: 'role/:id',
            loadComponent: () => import('./components/core/pages/dashboard-pages/admin/create-permissions/roleDetails.component').then(m => m.RoleDetailsComponent),
            data: { roles: ['admin', 'master'] }
          },
        ],
      },

      // {
      //   path: 'credPinBank/novo-credenciamento',
      //   loadComponent: () => import('./components/core/pages/dashboard-pages/credPinBank/new-accreditationPinBank/newAccreditationPinBank.component').then(m => m.NewAccreditationComponentPinBank),
      //   data: { roles: ['admin', 'master', 'Criar Credenciamento'] }
      // },

      {
        path: 'gerar-contrato',
        loadComponent: () => import('./components/core/pages/dashboard-pages/contract/contractGenerate.component').then(m => m.ContractGenerateComponent)
      },

      {
        path: 'consultar-cliente',
        loadComponent: () => import('./components/core/pages/consultClient/consult.component').then(m => m.ConsultClientComponent)
      },

      {
        path: 'onboarding/:type',
        loadComponent: () => import('./components/core/pages/consultClient/bigData/ocr/onboarding/onboardingForm.component').then(m => m.onboardingFormComponent)
      },


      {
        path: 'ocr/result/:document/:datasets',
        loadComponent: () => import('./components/core/pages/consultClient/bigData/ocr/result/ocrSearchResult.component').then(m => m.ocrSearchResultComponent)
      },

      {
        path: 'todos-os-clientes',
        loadComponent: () => import('./components/core/pages/dashboard-pages/clients/clients.component').then(m => m.ClientsComponent),
        data: { roles: ['admin', 'master', 'Criar Credenciamento'] }
      },

      {
        path: 'todos-os-clientes/:page',
        loadComponent: () => import('./components/core/pages/dashboard-pages/clients/clients.component').then(m => m.ClientsComponent),
        data: { roles: ['admin', 'master', 'Criar Credenciamento'] }
      },

      {
        path: 'credAdiq/clients',
        loadComponent: () => import('./components/core/pages/dashboard-pages/clients/clients.component').then(m => m.ClientsComponent)
      },

      {
        path: 'credAdiq/aguardando-aprovacao',
        loadComponent: () => import('./components/core/pages/dashboard-pages/credAdiq/awaiting-approval/awaitingApproval.component').then(m => m.AwaitingApprovalComponent)
      },

      {
        path: 'credAdiq/novo-credenciamento',
        loadComponent: () => import('./components/core/pages/dashboard-pages/credAdiq/new-accreditation/newAccreditation.component').then(m => m.NewAccreditationComponent)
      },

      {
        path: 'credAdiq/solicitacoes',
        loadComponent: () => import('./components/core/pages/dashboard-pages/credAdiq/track-requests/adiqRequests.component').then(m => m.AdiqRequestsComponent)
      },

      {
        path: 'credAdiq/solicitacoes/:page',
        loadComponent: () => import('./components/core/pages/dashboard-pages/credAdiq/track-requests/adiqRequests.component').then(m => m.AdiqRequestsComponent)
      },
      {
        path: 'credAdiq/acompanhar-solicitacoes/:id',
        loadComponent: () => import('./components/core/pages/dashboard-pages/credAdiq/track-requests/adiqRequestByClient.component').then(m => m.AdiqRequestByClientComponent)
      },

      {
        path: 'credAdiq/check-proposal',
        loadComponent: () => import('./components/core/pages/dashboard-pages/credAdiq/proposal-check/proposalCheck.component').then(m => m.ProposalCheckComponent)
      },

      {
        path: 'clients/details/:id',

        loadComponent: () => import('./components/core/pages/dashboard-pages/clients/clientsDetailsForm/clientsDetails.component').then(m => m.ClientsDetailsComponent)
      },

      {
        path: 'perfil',
        loadComponent: () => import('./components/core/pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivateChild: [PermissionsGuard]
      },


    ]
  },
  { path: '**', pathMatch: 'full',
    component: PagenotfoundComponent },

];
