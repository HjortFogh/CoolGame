/**
 * Checks if an objects class is a subclass of a class
 * @param {Object} obj Object to check
 * @param {Class} cls Class to check
 * @returns {Boolean}
 */
export function isObjectChildOfClass(obj, cls) {
    if (typeof obj !== "object") throw `'${obj}' not an object`;
    if (typeof cls !== "function") throw `'${cls}' not a class`;
    return obj instanceof cls;
}

/**
 * Checks if a class is a subclass of another class
 * @param {Class} cls1 Child class to check
 * @param {Class} cls2 Parent class
 * @returns {Boolean}
 */
export function isClassChildOfClass(cls1, cls2) {
    if (typeof cls1 !== "function") throw `'${cls}' not a class`;
    if (typeof cls2 !== "function") throw `'${cls}' not a class`;
    return cls1.prototype instanceof cls2;
}

/**
 * Checks if an object is a type of a specific class
 * @param {Object} obj Object to check
 * @param {Class} cls Class to check
 * @returns {Boolean}
 */
export function isObjectOfClass(obj, cls) {
    if (typeof obj !== "object") throw `'${obj}' not an object`;
    if (typeof cls !== "function") throw `'${cls}' not a class`;
    return obj.constructor === cls;
}

/**
 * Gets a string name for an object or class
 * @param {Object|Class} item
 * @returns {String}
 */
export function getName(item) {
    if (typeof item === "object") return item.constructor.name;
    else if (typeof item === "function") return item.name;
}
