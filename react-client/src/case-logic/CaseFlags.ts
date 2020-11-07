
export default class CaseFlags {
    flags: Map<string, number | string>;

    constructor() {
        this.flags = new Map<string, number | string>();
    }

    set(id: string, value: number | string) {
        this.flags.set(id, value);
    }

    reset(id: string) {
        this.flags.delete(id);
    }

    get(id: string) {
        return this.flags.get(id);
    }

    getNum(id: string) {
        let flag = this.flags.get(id);
        return (typeof flag == "number") ? flag : 0;
    }

    getString(id: string) {
        let flag = this.flags.get(id);
        return (typeof flag == "string") ? flag : "";
    }

    incFlag(id: string) {
        let num: number = this.getNum(id);
        num++;
        this.set(id, num);
    }

    decFlag(id: string) {
        let num: number = this.getNum(id);
        num--;
        this.set(id, num);
    }

    update(object: any){
        if (object == null) {
            return;
        }
        if (object.inc)
            for (let value of object.inc.values())
                this.incFlag(value);
        if (object.dec)
            for (let value of object.dec.values())
                this.decFlag(value);
        if (object.set)
            for (let key in object.set)
                if (object.set.hasOwnProperty(key))
                    this.set(key, object.set[key]);
        if (object.reset)
            for (let value of object.reset.values())
                this.reset(value);
    }

    public replaceFlagsWithValues(input: string) : string{
        let result : string = input;
        for(let key of this.flags.keys()){
            let value = this.getString(key);
            let replace = `[${key}]`;
            result = result.split(replace).join(value);
        }
        return result;
    }
}