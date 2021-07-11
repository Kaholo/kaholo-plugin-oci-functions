function parseArray(value){
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof(value) === "string") return value.split("\n").map(line=>line.trim()).filter(line=>line);
    throw "Unsupprted array format";
}

module.exports = {
    boolean : (value) =>{
        if (value === undefined || value === null || value === '') return undefined;
        return !!(value && value !=="false")
    },
    text : (value) =>{
        if (value)
            return value.split('\n');
        return undefined;
    },
    number: (value)=>{
        if (!value) return undefined;
        const parsed = parseInt(value);
        if (parsed === NaN) {
            throw `Value ${value} is not a valid number`
        }
        return parsed;
    },
    autocomplete: (value)=>{
        if (!value) return undefined;
        if (value.id) return value.id;
        return value;
    },
    object: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "object") return value;
        if (typeof(value) === "string"){
            const lines = value.split("\n").map(item => item.trim()).filter(item => item);
            const obj = {};
            lines.forEach(line => {
                const [key, ...val] = line.split("=");
                if (!val) val = "";
                if (Array.isArray(val)) val = val.join("=");
                obj[key] = val;
            })
            return obj;
        }
        throw `Value ${value} is not an object`;
    },
    string: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "string") return value.trim();
        throw `Value ${value} is not a valid string`;
    },
    array: parseArray
}