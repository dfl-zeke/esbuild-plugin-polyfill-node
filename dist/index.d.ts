import { Plugin } from 'esbuild';

interface PolyfillNodeOptions {
    globals?: {
        /**
         * Whether to inject the `Buffer` global.
         *
         * Disable it to prevent code like `if (typeof Buffer !== "undefined")`
         * from pulling in the (quite large) Buffer polyfill.
         *
         * @default true
         */
        buffer?: boolean;
        /**
         * Whether to inject the `process` global.
         *
         * Disable it to prevent `process.env.NODE_ENV` from pulling in the
         * `process-es6` polyfill. You can use the `define` option to replace
         * `process.env.NODE_ENV` instead.
         *
         * @default true
         */
        process?: boolean;
    };
    polyfills?: {
        _buffer_list?: boolean | "empty";
        _stream_passthrough?: boolean | "empty";
        _stream_readable?: boolean | "empty";
        _stream_transform?: boolean | "empty";
        _stream_writable?: boolean | "empty";
        assert?: boolean | "empty";
        buffer?: boolean | "empty";
        console?: boolean | "empty";
        crypto?: boolean | "empty";
        domain?: boolean | "empty";
        events?: boolean | "empty";
        fs?: boolean | "empty";
        http?: boolean | "empty";
        https?: boolean | "empty";
        inherits?: boolean | "empty";
        os?: boolean | "empty";
        path?: boolean | "empty";
        process?: boolean | "empty";
        punycode?: boolean | "empty";
        querystring?: boolean | "empty";
        stream?: boolean | "empty";
        string_decoder?: boolean | "empty";
        sys?: boolean | "empty";
        timers?: boolean | "empty";
        tty?: boolean | "empty";
        url?: boolean | "empty";
        util?: boolean | "empty";
        vm?: boolean | "empty";
        zlib?: boolean | "empty";
        dns?: false | "empty";
        dgram?: false | "empty";
        cluster?: false | "empty";
        repl?: false | "empty";
        tls?: false | "empty";
    };
}
declare function polyfillNode(options?: PolyfillNodeOptions): Plugin;
interface PolyfillNodeForDenoOptions {
    stdVersion?: string;
    globals?: boolean;
    polyfills?: {
        assert?: boolean | "npm" | "empty";
        "assert/strict"?: boolean | "empty";
        buffer?: boolean | "npm" | "empty";
        child_process?: boolean | "empty";
        console?: boolean | "npm" | "empty";
        constants?: boolean | "empty";
        crypto?: boolean | "npm" | "empty";
        domain?: false | "npm" | "empty";
        events?: boolean | "npm" | "empty";
        fs?: boolean | "npm" | "empty";
        "fs/promises"?: boolean | "empty";
        http?: boolean | "npm" | "empty";
        https?: boolean | "npm" | "empty";
        inherits?: boolean | "npm" | "empty";
        module?: boolean | "empty";
        net?: boolean | "empty";
        os?: boolean | "npm" | "empty";
        path?: boolean | "npm" | "empty";
        perf_hooks?: boolean | "empty";
        process?: boolean | "npm" | "empty";
        punycode?: false | "npm" | "empty";
        querystring?: boolean | "npm" | "empty";
        readline?: boolean | "empty";
        stream?: boolean | "npm" | "empty";
        string_decoder?: boolean | "npm" | "empty";
        sys?: boolean | "npm" | "empty";
        timers?: boolean | "npm" | "empty";
        "timers/promises"?: boolean | "empty";
        tty?: boolean | "npm" | "empty";
        url?: boolean | "npm" | "empty";
        util?: boolean | "npm" | "empty";
        vm?: false | "npm" | "empty";
        worker_threads?: boolean | "empty";
        zlib?: false | "npm" | "empty";
        dns?: false | "empty";
        dgram?: false | "empty";
        cluster?: false | "empty";
        repl?: false | "empty";
        tls?: false | "empty";
    };
}
declare function polyfillNodeForDeno(options?: PolyfillNodeForDenoOptions): Plugin;

export { PolyfillNodeForDenoOptions, PolyfillNodeOptions, polyfillNode, polyfillNodeForDeno };
