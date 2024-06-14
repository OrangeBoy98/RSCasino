class User {
    constructor(username,email,password) {
        this.username = username;
        this.email = email;
        this.img = null;
        this.phone = null;
        this.password = 123;
        this.isAdmin = false;
        this.money = 0;
    }
    
    save(){
        pool.query("INSERT INTO")
    }
}