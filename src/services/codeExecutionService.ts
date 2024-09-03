import util from 'node:util';
import { exec } from 'node:child_process';

const executor = util.promisify(exec);
async function executeCode(
  encodeCode: string,
  inputValue: string,
  language: string,
) {
  try {
    const { stdout, stderr } = await executor(
      `docker run --rm -i \
    --security-opt no-new-privileges \
    --network none \
    --read-only \
    --cpus=".5" \
    --memory="256m" \
    --tmpfs /mnt:rw,size=10m \
    java-executor \
    bash -c ' \
    echo "${encodeCode}" | base64 -d > /mnt/Main.java && \
    echo "${inputValue}" | base64 -d  > /mnt/input.txt && \
    javac /mnt/Main.java -d /mnt && \
    java -cp /mnt Main < /mnt/input.txt'`,
    );

    // console.log('std', stdout);
    return stdout;
  } catch (error: any) {
    // console.log('err', error.stderr);
    throw new Error(error.stderr);
  }
}

// executeCode(
//   'aW1wb3J0IGphdmEudXRpbC4qOwoKcHVibGljIGNsYXNzIE1haW4gewogIHB1YmxpYyBzdGF0aWMgdm9pZCBtYWluKFN0cmluZ1tdIGFyZ3MpIHsKICAgIFNjYW5uZXIgc2NuID0gbmV3IFNjYW5uZXIoU3lzdGVtLmluKTsKCiAgICBpbnQgbiA9IHNjbi5uZXh0SW50KCk7CiAgICBTeXN0ZW0ub3V0LnByaW50bG4obik7CgogICAgaW50W10gYXJyID0gbmV3IGludFtuXTsKICAgIGZvciAoaW50IGkgPSAwOyBpIDwgbjsgaSsrKSB7CiAgICAgIGFycltpXSA9IHNjbi5uZXh0SW50KCk7CiAgICB9CgogICAgZm9yIChpbnQgdmFsIDogYXJyKSB7CiAgICAgIFN5c3RlbS5vdXQucHJpbnRsbih2YWwpOwogICAgfQogIH0KfQo=',
//   'NAoyCjcKMTEKMTU=',
//   'java',
// );

export default executeCode;
