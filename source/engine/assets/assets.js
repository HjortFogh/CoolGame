// Exports:
// - AssetManager

/**
 * Manages all assets used within the game
 */
export class AssetManager {
    /**
     * @type {Map<String, *>}
     * @static
     */
    static #assets = new Map();

    /**
     * Stores an asset
     * @param {*} asset Asset to add
     * @param {String} assetName Name of asset to store
     * @static
     */
    static addAsset(asset, assetName) {
        if (typeof assetName != "string") {
            console.warn(`Asset name not a string`);
            return;
        }
        if (AssetManager.#assets.has(assetName)) {
            console.warn(`Asset: '${assetName}' already a registed asset`);
            return;
        }
        AssetManager.#assets.set(assetName, asset);
    }

    /**
     * Retrives a asset
     * @param {String} assetName Name of asset used when the asset was stored
     * @returns {*}
     * @static
     */
    static getAsset(assetName) {
        if (typeof assetName != "string") {
            console.warn(`Asset name not a string`);
            return;
        }
        if (!AssetManager.#assets.has(assetName)) {
            console.warn(`Asset: '${assetName}' does not exist`);
            return;
        }
        return AssetManager.#assets.get(assetName);
    }
}
