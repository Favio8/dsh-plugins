import { Context } from "@deepseek-ai/cordis";
//#region src/index.d.ts
declare const name = "task-notify";
declare const inject: string[];
declare function apply(ctx: Context): void;
//#endregion
export { apply, inject, name };