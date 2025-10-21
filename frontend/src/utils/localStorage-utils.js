export class LocalStorageUtils {
    static CategoryKey = 'category'
    static OperationKey = 'operation'

    static async setCategory(value) {
        localStorage.setItem(this.CategoryKey, JSON.stringify(value));
    }

    static async getCategory() {
        return JSON.parse(localStorage.getItem(this.CategoryKey));
    }

    static async removeCategory(key) {
        localStorage.removeItem(this.CategoryKey);
    }

    static setOperation(value){
        localStorage.setItem(this.OperationKey, JSON.stringify(value));
    }
    static getOperation(){
        return JSON.parse(localStorage.getItem(this.OperationKey));
    }

    static removeOperation(key){
        localStorage.removeItem(this.OperationKey);
    }
}