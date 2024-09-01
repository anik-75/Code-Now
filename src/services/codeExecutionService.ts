import util from 'node:util';
import { exec } from 'node:child_process';

const executor = util.promisify(exec);
async function executeCode(encodeCode: string, language: string) {
  try {
    const { stdout, stderr } = await executor(
      `echo "${encodeCode}" | docker run --rm -i \
    --security-opt no-new-privileges \
    --network none \
    --read-only \
    --cpus=".5" \
    --memory="256m" \
    --tmpfs /tmp:rw,size=10m \
    java-executor`,
    );
    return stdout;
  } catch (error: any) {
    throw new Error(error.stderr);
  }
}

export default executeCode;
