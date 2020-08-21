class Enum {
    static GetAll(){
        let ris = [];
        for(let p in this){
            ris.push(this[p]);
        }
        return ris;
    }
}

export class AppRole extends Enum
{
    static Admin: string = "Admin";
    static Manager: string = "Manager";
    static User: string = "User";
}