interface IPureObject {
  [key: string]: any;
}

/** 去掉部分字段 */
export type Skip<T extends IPureObject, SKIP extends IPureObject> = {
  [key in Exclude<keyof T, keyof SKIP>]: T[key]
};
