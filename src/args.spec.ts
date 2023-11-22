import { describe, expect, it } from "@jest/globals";
import { getArg, hasArg } from "./args";

describe("args", () => {
  it("hasArg: missing argument should return false", () => {
    expect(hasArg('noway')).toEqual(false);
  });
  it("getArg: missing argument should return default", () => {
    expect(getArg('noway', 'def')).toEqual('def');
  });
});
