import * as humps from "humps";

export function camelizeColumnNames(data) {
    const template = data[0];
    for (let prop in template) {
        let camel = humps.camelize(prop);
        if (!(camel in template)) {
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
}