FROM openjdk:11
WORKDIR /usr/src/sandbox

# Command to decode, compile, and run the Java code
ENTRYPOINT ["/bin/bash", "-c", "base64 -d > /tmp/Main.java && javac /tmp/Main.java -d /tmp && java -cp /tmp Main"]
