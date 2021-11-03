// 新建一个名为maobili的js，内容为
import ffi from "ffi-napi";
import ref from "ref-napi";
import struct from "ref-struct-napi";

const INT = ref.types.int;

const AccentPolicy = struct({
  AccentState: INT,
  AccentFlags: INT,
  GradientColor: INT,
  AnimationId: INT,
});
const WindowCompositionAttributeData = struct({
  Attribute: INT,
  Data: ref.refType(AccentPolicy),
  SizeOfData: INT,
});

const accent = new AccentPolicy();
accent.AccentState = 3;
accent.GradientColor = 0;

const windowcompositon = new WindowCompositionAttributeData();
windowcompositon.Attribute = 19;
windowcompositon.Data = accent.ref();
windowcompositon.SizeOfData = accent.ref().byteLength;

const user32 = new ffi.Library("user32", {
  SetWindowCompositionAttribute: [
    INT,
    [INT, ref.refType(WindowCompositionAttributeData)],
  ],
});
// 导出
export { windowcompositon, user32 };