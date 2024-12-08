import JSDOMEnvironment from "jest-environment-jsdom";
import { TextEncoder } from "util";

export default class FixJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
    super(...args);

    this.global.fetch = fetch;
    this.global.Headers = Headers;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.TextEncoder = TextEncoder;
    this.global.TransformStream = TransformStream;
    this.global.BroadcastChannel = BroadcastChannel;
  }
}
