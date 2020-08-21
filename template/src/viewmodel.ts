export class LoginVm
{
    email: string;
    password: string;
}

export class PasswordResetVm
{
    email: string;
    token: string;
    newPassword: string;
}

export class DashboardVm
{
    totalCustomers: number;
    totalSales: number;
    totalProducts: number;
}

export class MakeSaleVm
{
    customerIdentifier: string;
    productIdentifier: string;
}