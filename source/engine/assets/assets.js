export class AssetManager {
    static assets = new Map();

    static addAsset(asset, assetName) {
        if (this.assets.has(assetName)) throw `Asset: '${assetName}' already a registed asset`;
        this.assets.set(assetName, asset);
    }

    static getAsset(assetName) {
        if (!this.assets.has(assetName)) throw `Asset: '${assetName}' does not exist`;
        return this.assets.get(assetName);
    }
}
