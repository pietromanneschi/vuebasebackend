
class BaseEntity
{
    identifier: string;
    createdOn: string;
}

export class LoginResponse
{
    token: string;
    userIdentifier: string;
}

export class LoginData
{
    email: string;
    password: string;
    resetPasswordToken: string;
}

export class User extends BaseEntity
{
    name: string;
    surname: string;
    loginData: LoginData;
    role: string;
}

export class NameIdentifier {
    name: string;
    identifier: string;
}

export class Sale extends BaseEntity
{
    customer: NameIdentifier;
    product: NameIdentifier;
}

export class Customer extends BaseEntity
{
    name: string;
    surname: string;
    email: string;
    telephone: string;
    address: string;
    hasVat: boolean;
    vatNumber: string;
    codiceDestinatario: string;
    pec: string;
    note: string;
}

export class Product extends BaseEntity
{
    name: string;
    price: string;
    constructor(){
        super();
        this.name = "";
        this.price = "";
    }
}