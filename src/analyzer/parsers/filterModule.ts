const r: RegExp = /cache|webpack|node_modules/;
export const isAppSourcesPath = (key: string) => !r.test(key)
