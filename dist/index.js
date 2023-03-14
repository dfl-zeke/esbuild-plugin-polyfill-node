// src/index.ts
import { fileURLToPath, pathToFileURL } from "url";
import { resolve, dirname } from "path";
var filename =
	typeof __filename === "undefined"
		? fileURLToPath(import.meta.url)
		: __filename;
var importMetaUrl = import.meta.url ?? pathToFileURL(filename).href;
function polyfillNode(options = {}) {
	const { globals: { buffer = true, process = true } = {}, polyfills = {} } =
		options;
	polyfills.fs = polyfills.fs ?? "empty";
	polyfills.crypto = polyfills.crypto ?? "empty";
	polyfills.dns = polyfills.dns ?? "empty";
	polyfills.dgram = polyfills.dgram ?? "empty";
	polyfills.cluster = polyfills.cluster ?? "empty";
	polyfills.repl = polyfills.repl ?? "empty";
	polyfills.tls = polyfills.tls ?? "empty";
	const moduleNames = [
		.../* @__PURE__ */ new Set([
			...Object.keys(npmPolyfillMap),
			...emptyShims.keys(),
			...Object.keys(polyfills),
			"inherits",
		]),
	];
	const filter = new RegExp(`^(node:)?(${moduleNames.join("|")})$`);
	return {
		name: "node-polyfills",
		setup(build) {
			build.onResolve({ filter }, async ({ path, importer }) => {
				const [, , moduleName] = path.match(filter);
				const polyfill = polyfills[moduleName] ?? true;
				if (polyfill === false) {
					return;
				} else if (polyfill === "empty") {
					return {
						path: resolve(dirname(filename), "../polyfills/empty.js"),
					};
				} else if (
					moduleName === "inherits" &&
					importer === (await resolveImport("util/util.js"))
				) {
					return {
						path: resolve(dirname(filename), "../polyfills/inherits.js"),
					};
				} else if (!npmPolyfillMap[moduleName]) {
					throw new Error("Cannot find polyfill for " + moduleName);
				}
				return {
					path: await resolveImport(npmPolyfillMap[moduleName]),
				};
			});
			build.initialOptions.inject = build.initialOptions.inject || [];
			build.initialOptions.inject.push(
				resolve(dirname(filename), "../polyfills/global.js"),
				resolve(dirname(filename), "../polyfills/__dirname.js"),
				resolve(dirname(filename), "../polyfills/__filename.js"),
			);
			if (buffer) {
				build.initialOptions.inject.push(
					resolve(dirname(filename), "../polyfills/buffer.js"),
				);
			}
			if (process) {
				build.initialOptions.inject.push(
					resolve(dirname(filename), "../polyfills/process.js"),
				);
			}
		},
	};
}
function polyfillNodeForDeno(options = {}) {
	const { stdVersion = "0.160.0", globals = true, polyfills = {} } = options;
	polyfills.dns = polyfills.dns ?? "empty";
	polyfills.dgram = polyfills.dgram ?? "empty";
	polyfills.cluster = polyfills.cluster ?? "empty";
	polyfills.repl = polyfills.repl ?? "empty";
	polyfills.tls = polyfills.tls ?? "empty";
	const moduleNames = [
		.../* @__PURE__ */ new Set([
			...Object.keys(npmPolyfillMap),
			...emptyShims.keys(),
			...Object.keys(polyfills),
			"inherits",
		]),
	];
	const filter = new RegExp(`^(node:)?(${moduleNames.join("|")})$`);
	return {
		name: "node-polyfills",
		setup(build) {
			build.onResolve(
				{
					filter: /^virtual:deno-std-node-global$/,
				},
				() => ({
					path: `https://deno.land/std@${stdVersion}/node/global.ts`,
					external: true,
				}),
			);
			build.onResolve({ filter }, async ({ path, importer }) => {
				const [, , moduleName] = path.match(filter);
				const polyfill = polyfills[moduleName] ?? true;
				if (polyfill === false) {
					return;
				} else if (polyfill === "empty") {
					return {
						path: resolve(dirname(filename), "../polyfills/empty.js"),
					};
				} else if (
					moduleName === "inherits" &&
					polyfills.util === "npm" &&
					importer === (await resolveImport("util/util.js"))
				) {
					return {
						path: resolve(dirname(filename), "../polyfills/inherits.js"),
					};
				} else if (polyfill === true) {
					if (!denoPolyfills.has(moduleName)) {
						throw new Error("Cannot find the Deno polyfill for " + moduleName);
					}
					return {
						path: `https://deno.land/std@${stdVersion}/node/${moduleName}.ts`,
						external: true,
					};
				}
				if (!npmPolyfillMap[moduleName]) {
					throw new Error("Cannot find NPM polyfill for " + moduleName);
				}
				return {
					path: await resolveImport(npmPolyfillMap[moduleName]),
				};
			});
			build.onLoad({ namespace: "polyfillNodeForDeno", filter: /.*/ }, () => ({
				contents: denoGlobalsContents(stdVersion),
			}));
			if (globals) {
				build.initialOptions.footer;
				build.initialOptions.inject = build.initialOptions.inject || [];
				build.initialOptions.inject.push(
					resolve(dirname(filename), "../polyfills/global-for-deno.js"),
					resolve(dirname(filename), "../polyfills/__dirname.js"),
					resolve(dirname(filename), "../polyfills/__filename.js"),
				);
			}
		},
	};
}
var npmPolyfillMap = {
	_buffer_list: "readable-stream/lib/internal/streams/buffer_list.js",
	_stream_passthrough: "readable-stream/lib/_stream_passthrough.js",
	_stream_readable: "readable-stream/lib/_stream_readable.js",
	_stream_transform: "readable-stream/lib/_stream_transform.js",
	_stream_writable: "readable-stream/lib/_stream_writable.js",
	assert: "assert/build/assert.js",
	buffer: "buffer-es6/index.js",
	console: "console-browserify/index.js",
	crypto: "crypto-browserify/index.js",
	domain: "domain-browser/source/index.js",
	events: "events/events.js",
	fs: "browserify-fs/index.js",
	http: "stream-http/index.js",
	https: "stream-http/index.js",
	os: "os-browserify/browser.js",
	path: "path/path.js",
	process: "process-es6/browser.js",
	punycode: "punycode/punycode.es6.js",
	querystring: "querystring/index.js",
	stream: "stream/index.js",
	string_decoder: "string_decoder/lib/string_decoder.js",
	sys: "util/util.js",
	timers: "timers-browserify/main.js",
	tty: "tty-browserify/index.js",
	url: "url/url.js",
	util: "util/util.js",
	vm: "vm-browserify/index.js",
	zlib: "browserify-zlib/lib/index.js",
};
var emptyShims = /* @__PURE__ */ new Set([
	"dns",
	"dgram",
	"child_process",
	"cluster",
	"module",
	"net",
	"readline",
	"repl",
	"tls",
]);
var denoPolyfills = /* @__PURE__ */ new Set([
	"assert",
	"assert/strict",
	"buffer",
	"console",
	"constants",
	"crypto",
	"child_process",
	"dns",
	"events",
	"fs",
	"fs/promises",
	"http",
	"module",
	"net",
	"os",
	"path",
	"perf_hooks",
	"process",
	"querystring",
	"readline",
	"stream",
	"string_decoder",
	"sys",
	"timers",
	"timers/promises",
	"tty",
	"url",
	"util",
	"worker_threads",
]);
var importMetaResolve;
async function resolveImport(specifier) {
	if (!importMetaResolve) {
		importMetaResolve = (await import("import-meta-resolve")).resolve;
	}
	const resolved = await importMetaResolve(specifier, importMetaUrl);
	return fileURLToPath(resolved);
}
function denoGlobalsContents(stdVersion) {
	return `
		import "https://deno.land/std@${stdVersion}/node/global.ts";
		export const process = globalThis.process;
		export const Buffer = globalThis.Buffer;
		export const setImmediate = globalThis.setImmediate;
		export const clearImmediate = globalThis.clearImmediate;
	`;
}
export { polyfillNode, polyfillNodeForDeno };
