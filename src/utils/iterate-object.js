// helper generator to iterate by [key, value] over objects
export default function* iterateObject(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}
