import util from 'node:util';
import { exec } from 'node:child_process';

const executor = util.promisify(exec);
async function executeCode(
  encodeCode: string,
  inputValue: string,
  language: string,
) {
  try {
    let command = '';
    switch (language) {
      case 'java':
        command = `docker run --rm -i \
        --security-opt no-new-privileges \
        --network none \
        --read-only \
        --cpus=".5" \
        --memory="256m" \
        --tmpfs /tmp:rw,size=10m \
        anik462/java-executor \
        bash -c ' \
        echo "${encodeCode}" | base64 -d > /tmp/Main.java && \
        echo "${inputValue}" | base64 -d  > /tmp/input.txt && \
        javac /tmp/Main.java -d /tmp && \
        java -cp /tmp Main < /tmp/input.txt'`;
        break;

      case 'cpp':
        command = `docker run --rm -i \
        --security-opt no-new-privileges \
        --network none \
        --cpus=".5" \
        --memory="256m" \
        anik462/cpp-executor \
        bash -c ' \
        echo "${encodeCode}" | base64 -d > /tmp/main.cpp && \
        echo "${inputValue}" | base64 -d  > /tmp/input.txt && \
        g++ /tmp/main.cpp -o /tmp/main && \
        chmod +x /tmp/main && \
        /tmp/main < /tmp/input.txt'`;
        break;

      default:
        throw new Error('Language not supported.');
    }

    if (command) {
      let { stdout, stderr } = await executor(command);
      return stdout;
    }
    // console.log('std', stdout);
  } catch (error: any) {
    if (error.stderr) {
      throw new Error(error.stderr);
    } else {
      console.log(error.message);
    }
  }
}

// executeCode(
//   'I2luY2x1ZGUgPGlvc3RyZWFtPgoKaW50IG1haW4oKSB7CiAgICBpbnQgbjsKCiAgICAvLyBBc2sgdGhlIHVzZXIgZm9yIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGFycmF5CiAgICBzdGQ6OiA8PCAiRW50ZXIgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgYXJyYXk6ICI7CiAgICBzdGQ6OmNpbiA+PiBuOwoKICAgIC8vIENyZWF0ZSBhbiBhcnJheSBvZiBzaXplIG4KICAgIGludCBhcnJbbl07CgogICAgLy8gSW5wdXQgZWxlbWVudHMgaW50byB0aGUgYXJyYXkKICAgIHN0ZDo6Y291dCA8PCAiRW50ZXIgIiA8PCBuIDw8ICIgZWxlbWVudHM6IiA8PCBzdGQ6OmVuZGw7CiAgICBmb3IoaW50IGkgPSAwOyBpIDwgbjsgaSsrKSB7CiAgICAgICAgc3RkOjpjaW4gPj4gYXJyW2ldOwogICAgfQoKICAgIC8vIFByaW50IHRoZSBhcnJheQogICAgc3RkOjpjb3V0IDw8ICJUaGUgYXJyYXkgZWxlbWVudHMgYXJlOiAiOwogICAgZm9yKGludCBpID0gMDsgaSA8IG47IGkrKykgewogICAgICAgIHN0ZDo6Y291dCA8PCBhcnJbaV0gPDwgIiAiOwogICAgfQoKICAgIHJldHVybiAwOwp9Cg==',
//   'MwowCjEKMg==',
//   'cpp',
// );

export default executeCode;
