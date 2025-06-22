import * as __WEBPACK_EXTERNAL_MODULE_child_process__ from "child_process";
import * as __WEBPACK_EXTERNAL_MODULE_fs__ from "fs";
import * as __WEBPACK_EXTERNAL_MODULE_path__ from "path";
import * as __WEBPACK_EXTERNAL_MODULE_stream__ from "stream";
import { Buffer } from "node:buffer";
import node_path from "node:path";
import node_child_process, { ChildProcess } from "node:child_process";
import node_process from "node:process";
import node_url from "node:url";
import node_os, { constants } from "node:os";
import { createReadStream, createWriteStream, readFileSync } from "node:fs";
import { setTimeout as promises_setTimeout } from "node:timers/promises";
import { debuglog } from "node:util";
var __webpack_modules__ = {
    "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        const cp = __webpack_require__("child_process");
        const parse = __webpack_require__("../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js");
        const enoent = __webpack_require__("../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js");
        function spawn(command, args, options) {
            const parsed = parse(command, args, options);
            const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
            enoent.hookChildProcess(spawned, parsed);
            return spawned;
        }
        function spawnSync(command, args, options) {
            const parsed = parse(command, args, options);
            const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
            result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
            return result;
        }
        module.exports = spawn;
        module.exports.spawn = spawn;
        module.exports.sync = spawnSync;
        module.exports._parse = parse;
        module.exports._enoent = enoent;
    },
    "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js": function(module) {
        const isWin = 'win32' === process.platform;
        function notFoundError(original, syscall) {
            return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
                code: 'ENOENT',
                errno: 'ENOENT',
                syscall: `${syscall} ${original.command}`,
                path: original.command,
                spawnargs: original.args
            });
        }
        function hookChildProcess(cp, parsed) {
            if (!isWin) return;
            const originalEmit = cp.emit;
            cp.emit = function(name, arg1) {
                if ('exit' === name) {
                    const err = verifyENOENT(arg1, parsed);
                    if (err) return originalEmit.call(cp, 'error', err);
                }
                return originalEmit.apply(cp, arguments);
            };
        }
        function verifyENOENT(status, parsed) {
            if (isWin && 1 === status && !parsed.file) return notFoundError(parsed.original, 'spawn');
            return null;
        }
        function verifyENOENTSync(status, parsed) {
            if (isWin && 1 === status && !parsed.file) return notFoundError(parsed.original, 'spawnSync');
            return null;
        }
        module.exports = {
            hookChildProcess,
            verifyENOENT,
            verifyENOENTSync,
            notFoundError
        };
    },
    "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js": function(module, __unused_webpack_exports, __webpack_require__) {
        const path = __webpack_require__("path");
        const resolveCommand = __webpack_require__("../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js");
        const escape = __webpack_require__("../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js");
        const readShebang = __webpack_require__("../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js");
        const isWin = 'win32' === process.platform;
        const isExecutableRegExp = /\.(?:com|exe)$/i;
        const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
        function detectShebang(parsed) {
            parsed.file = resolveCommand(parsed);
            const shebang = parsed.file && readShebang(parsed.file);
            if (shebang) {
                parsed.args.unshift(parsed.file);
                parsed.command = shebang;
                return resolveCommand(parsed);
            }
            return parsed.file;
        }
        function parseNonShell(parsed) {
            if (!isWin) return parsed;
            const commandFile = detectShebang(parsed);
            const needsShell = !isExecutableRegExp.test(commandFile);
            if (parsed.options.forceShell || needsShell) {
                const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
                parsed.command = path.normalize(parsed.command);
                parsed.command = escape.command(parsed.command);
                parsed.args = parsed.args.map((arg)=>escape.argument(arg, needsDoubleEscapeMetaChars));
                const shellCommand = [
                    parsed.command
                ].concat(parsed.args).join(' ');
                parsed.args = [
                    '/d',
                    '/s',
                    '/c',
                    `"${shellCommand}"`
                ];
                parsed.command = process.env.comspec || 'cmd.exe';
                parsed.options.windowsVerbatimArguments = true;
            }
            return parsed;
        }
        function parse(command, args, options) {
            if (args && !Array.isArray(args)) {
                options = args;
                args = null;
            }
            args = args ? args.slice(0) : [];
            options = Object.assign({}, options);
            const parsed = {
                command,
                args,
                options,
                file: void 0,
                original: {
                    command,
                    args
                }
            };
            return options.shell ? parsed : parseNonShell(parsed);
        }
        module.exports = parse;
    },
    "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js": function(module) {
        const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
        function escapeCommand(arg) {
            arg = arg.replace(metaCharsRegExp, '^$1');
            return arg;
        }
        function escapeArgument(arg, doubleEscapeMetaChars) {
            arg = `${arg}`;
            arg = arg.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
            arg = arg.replace(/(?=(\\+?)?)\1$/, '$1$1');
            arg = `"${arg}"`;
            arg = arg.replace(metaCharsRegExp, '^$1');
            if (doubleEscapeMetaChars) arg = arg.replace(metaCharsRegExp, '^$1');
            return arg;
        }
        module.exports.command = escapeCommand;
        module.exports.argument = escapeArgument;
    },
    "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js": function(module, __unused_webpack_exports, __webpack_require__) {
        const fs = __webpack_require__("fs");
        const shebangCommand = __webpack_require__("../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js");
        function readShebang(command) {
            const size = 150;
            const buffer = Buffer.alloc(size);
            let fd;
            try {
                fd = fs.openSync(command, 'r');
                fs.readSync(fd, buffer, 0, size, 0);
                fs.closeSync(fd);
            } catch (e) {}
            return shebangCommand(buffer.toString());
        }
        module.exports = readShebang;
    },
    "../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js": function(module, __unused_webpack_exports, __webpack_require__) {
        const path = __webpack_require__("path");
        const which = __webpack_require__("../../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js");
        const getPathKey = __webpack_require__("../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js");
        function resolveCommandAttempt(parsed, withoutPathExt) {
            const env = parsed.options.env || process.env;
            const cwd = process.cwd();
            const hasCustomCwd = null != parsed.options.cwd;
            const shouldSwitchCwd = hasCustomCwd && void 0 !== process.chdir && !process.chdir.disabled;
            if (shouldSwitchCwd) try {
                process.chdir(parsed.options.cwd);
            } catch (err) {}
            let resolved;
            try {
                resolved = which.sync(parsed.command, {
                    path: env[getPathKey({
                        env
                    })],
                    pathExt: withoutPathExt ? path.delimiter : void 0
                });
            } catch (e) {} finally{
                if (shouldSwitchCwd) process.chdir(cwd);
            }
            if (resolved) resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
            return resolved;
        }
        function resolveCommand(parsed) {
            return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
        }
        module.exports = resolveCommand;
    },
    "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        __webpack_require__("fs");
        var core;
        core = 'win32' === process.platform || global.TESTING_WINDOWS ? __webpack_require__("../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js") : __webpack_require__("../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js");
        module.exports = isexe;
        isexe.sync = sync;
        function isexe(path, options, cb) {
            if ('function' == typeof options) {
                cb = options;
                options = {};
            }
            if (!cb) {
                if ('function' != typeof Promise) throw new TypeError('callback not provided');
                return new Promise(function(resolve, reject) {
                    isexe(path, options || {}, function(er, is) {
                        if (er) reject(er);
                        else resolve(is);
                    });
                });
            }
            core(path, options || {}, function(er, is) {
                if (er) {
                    if ('EACCES' === er.code || options && options.ignoreErrors) {
                        er = null;
                        is = false;
                    }
                }
                cb(er, is);
            });
        }
        function sync(path, options) {
            try {
                return core.sync(path, options || {});
            } catch (er) {
                if (options && options.ignoreErrors || 'EACCES' === er.code) return false;
                throw er;
            }
        }
    },
    "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js": function(module, __unused_webpack_exports, __webpack_require__) {
        module.exports = isexe;
        isexe.sync = sync;
        var fs = __webpack_require__("fs");
        function isexe(path, options, cb) {
            fs.stat(path, function(er, stat) {
                cb(er, er ? false : checkStat(stat, options));
            });
        }
        function sync(path, options) {
            return checkStat(fs.statSync(path), options);
        }
        function checkStat(stat, options) {
            return stat.isFile() && checkMode(stat, options);
        }
        function checkMode(stat, options) {
            var mod = stat.mode;
            var uid = stat.uid;
            var gid = stat.gid;
            var myUid = void 0 !== options.uid ? options.uid : process.getuid && process.getuid();
            var myGid = void 0 !== options.gid ? options.gid : process.getgid && process.getgid();
            var u = parseInt('100', 8);
            var g = parseInt('010', 8);
            var o = parseInt('001', 8);
            var ug = u | g;
            var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && 0 === myUid;
            return ret;
        }
    },
    "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js": function(module, __unused_webpack_exports, __webpack_require__) {
        module.exports = isexe;
        isexe.sync = sync;
        var fs = __webpack_require__("fs");
        function checkPathExt(path, options) {
            var pathext = void 0 !== options.pathExt ? options.pathExt : process.env.PATHEXT;
            if (!pathext) return true;
            pathext = pathext.split(';');
            if (-1 !== pathext.indexOf('')) return true;
            for(var i = 0; i < pathext.length; i++){
                var p = pathext[i].toLowerCase();
                if (p && path.substr(-p.length).toLowerCase() === p) return true;
            }
            return false;
        }
        function checkStat(stat, path, options) {
            if (!stat.isSymbolicLink() && !stat.isFile()) return false;
            return checkPathExt(path, options);
        }
        function isexe(path, options, cb) {
            fs.stat(path, function(er, stat) {
                cb(er, er ? false : checkStat(stat, path, options));
            });
        }
        function sync(path, options) {
            return checkStat(fs.statSync(path), path, options);
        }
    },
    "../../node_modules/.pnpm/merge-stream@2.0.0/node_modules/merge-stream/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        const { PassThrough } = __webpack_require__("stream");
        module.exports = function() {
            var sources = [];
            var output = new PassThrough({
                objectMode: true
            });
            output.setMaxListeners(0);
            output.add = add;
            output.isEmpty = isEmpty;
            output.on('unpipe', remove);
            Array.prototype.slice.call(arguments).forEach(add);
            return output;
            function add(source) {
                if (Array.isArray(source)) {
                    source.forEach(add);
                    return this;
                }
                sources.push(source);
                source.once('end', remove.bind(null, source));
                source.once('error', output.emit.bind(output, 'error'));
                source.pipe(output, {
                    end: false
                });
                return this;
            }
            function isEmpty() {
                return 0 == sources.length;
            }
            function remove(source) {
                sources = sources.filter(function(it) {
                    return it !== source;
                });
                if (!sources.length && output.readable) output.end();
            }
        };
    },
    "../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js": function(module) {
        const pathKey = (options = {})=>{
            const environment = options.env || process.env;
            const platform = options.platform || process.platform;
            if ('win32' !== platform) return 'PATH';
            return Object.keys(environment).reverse().find((key)=>'PATH' === key.toUpperCase()) || 'Path';
        };
        module.exports = pathKey;
        module.exports["default"] = pathKey;
    },
    "../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js": function(module, __unused_webpack_exports, __webpack_require__) {
        const shebangRegex = __webpack_require__("../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js");
        module.exports = (string = '')=>{
            const match = string.match(shebangRegex);
            if (!match) return null;
            const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
            const binary = path.split('/').pop();
            if ('env' === binary) return argument;
            return argument ? `${binary} ${argument}` : binary;
        };
    },
    "../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js": function(module) {
        module.exports = /^#!(.*)/;
    },
    "../../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js": function(module, __unused_webpack_exports, __webpack_require__) {
        const isWindows = 'win32' === process.platform || 'cygwin' === process.env.OSTYPE || 'msys' === process.env.OSTYPE;
        const path = __webpack_require__("path");
        const COLON = isWindows ? ';' : ':';
        const isexe = __webpack_require__("../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js");
        const getNotFoundError = (cmd)=>Object.assign(new Error(`not found: ${cmd}`), {
                code: 'ENOENT'
            });
        const getPathInfo = (cmd, opt)=>{
            const colon = opt.colon || COLON;
            const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [
                ''
            ] : [
                ...isWindows ? [
                    process.cwd()
                ] : [],
                ...(opt.path || process.env.PATH || '').split(colon)
            ];
            const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM' : '';
            const pathExt = isWindows ? pathExtExe.split(colon) : [
                ''
            ];
            if (isWindows) {
                if (-1 !== cmd.indexOf('.') && '' !== pathExt[0]) pathExt.unshift('');
            }
            return {
                pathEnv,
                pathExt,
                pathExtExe
            };
        };
        const which = (cmd, opt, cb)=>{
            if ('function' == typeof opt) {
                cb = opt;
                opt = {};
            }
            if (!opt) opt = {};
            const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
            const found = [];
            const step = (i)=>new Promise((resolve, reject)=>{
                    if (i === pathEnv.length) return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
                    const ppRaw = pathEnv[i];
                    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
                    const pCmd = path.join(pathPart, cmd);
                    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
                    resolve(subStep(p, i, 0));
                });
            const subStep = (p, i, ii)=>new Promise((resolve, reject)=>{
                    if (ii === pathExt.length) return resolve(step(i + 1));
                    const ext = pathExt[ii];
                    isexe(p + ext, {
                        pathExt: pathExtExe
                    }, (er, is)=>{
                        if (!er && is) if (!opt.all) return resolve(p + ext);
                        else found.push(p + ext);
                        return resolve(subStep(p, i, ii + 1));
                    });
                });
            return cb ? step(0).then((res)=>cb(null, res), cb) : step(0);
        };
        const whichSync = (cmd, opt)=>{
            opt = opt || {};
            const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
            const found = [];
            for(let i = 0; i < pathEnv.length; i++){
                const ppRaw = pathEnv[i];
                const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
                const pCmd = path.join(pathPart, cmd);
                const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
                for(let j = 0; j < pathExt.length; j++){
                    const cur = p + pathExt[j];
                    try {
                        const is = isexe.sync(cur, {
                            pathExt: pathExtExe
                        });
                        if (is) if (!opt.all) return cur;
                        else found.push(cur);
                    } catch (ex) {}
                }
            }
            if (opt.all && found.length) return found;
            if (opt.nothrow) return null;
            throw getNotFoundError(cmd);
        };
        module.exports = which;
        which.sync = whichSync;
    },
    child_process: function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_child_process__;
    },
    fs: function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_fs__;
    },
    path: function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_path__;
    },
    stream: function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_stream__;
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
var cross_spawn = __webpack_require__("../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js");
function stripFinalNewline(input) {
    const LF = 'string' == typeof input ? '\n' : '\n'.charCodeAt();
    const CR = 'string' == typeof input ? '\r' : '\r'.charCodeAt();
    if (input[input.length - 1] === LF) input = input.slice(0, -1);
    if (input[input.length - 1] === CR) input = input.slice(0, -1);
    return input;
}
function pathKey(options = {}) {
    const { env = process.env, platform = process.platform } = options;
    if ('win32' !== platform) return 'PATH';
    return Object.keys(env).reverse().find((key)=>'PATH' === key.toUpperCase()) || 'Path';
}
function npmRunPath(options = {}) {
    const { cwd = node_process.cwd(), path: path_ = node_process.env[pathKey()], execPath = node_process.execPath } = options;
    let previous;
    const cwdString = cwd instanceof URL ? node_url.fileURLToPath(cwd) : cwd;
    let cwdPath = node_path.resolve(cwdString);
    const result = [];
    while(previous !== cwdPath){
        result.push(node_path.join(cwdPath, 'node_modules/.bin'));
        previous = cwdPath;
        cwdPath = node_path.resolve(cwdPath, '..');
    }
    result.push(node_path.resolve(cwdString, execPath, '..'));
    return [
        ...result,
        path_
    ].join(node_path.delimiter);
}
function npmRunPathEnv({ env = node_process.env, ...options } = {}) {
    env = {
        ...env
    };
    const path = pathKey({
        env
    });
    options.path = env[path];
    env[path] = npmRunPath(options);
    return env;
}
const copyProperty = (to, from, property, ignoreNonConfigurable)=>{
    if ('length' === property || 'prototype' === property) return;
    if ('arguments' === property || 'caller' === property) return;
    const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
    const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
    if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) return;
    Object.defineProperty(to, property, fromDescriptor);
};
const canCopyProperty = function(toDescriptor, fromDescriptor) {
    return void 0 === toDescriptor || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
const changePrototype = (to, from)=>{
    const fromPrototype = Object.getPrototypeOf(from);
    if (fromPrototype === Object.getPrototypeOf(to)) return;
    Object.setPrototypeOf(to, fromPrototype);
};
const wrappedToString = (withName, fromBody)=>`/* Wrapped ${withName}*/\n${fromBody}`;
const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name');
const changeToString = (to, from, name)=>{
    const withName = '' === name ? '' : `with ${name.trim()}() `;
    const newToString = wrappedToString.bind(null, withName, from.toString());
    Object.defineProperty(newToString, 'name', toStringName);
    Object.defineProperty(to, 'toString', {
        ...toStringDescriptor,
        value: newToString
    });
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
    const { name } = to;
    for (const property of Reflect.ownKeys(from))copyProperty(to, from, property, ignoreNonConfigurable);
    changePrototype(to, from);
    changeToString(to, from, name);
    return to;
}
const calledFunctions = new WeakMap();
const onetime_onetime = (function_, options = {})=>{
    if ('function' != typeof function_) throw new TypeError('Expected a function');
    let returnValue;
    let callCount = 0;
    const functionName = function_.displayName || function_.name || '<anonymous>';
    const onetime = function(...arguments_) {
        calledFunctions.set(onetime, ++callCount);
        if (1 === callCount) {
            returnValue = function_.apply(this, arguments_);
            function_ = null;
        } else if (true === options.throw) throw new Error(`Function \`${functionName}\` can only be called once`);
        return returnValue;
    };
    mimicFunction(onetime, function_);
    calledFunctions.set(onetime, callCount);
    return onetime;
};
onetime_onetime.callCount = (function_)=>{
    if (!calledFunctions.has(function_)) throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
    return calledFunctions.get(function_);
};
const node_modules_onetime = onetime_onetime;
const getRealtimeSignals = ()=>{
    const length = SIGRTMAX - SIGRTMIN + 1;
    return Array.from({
        length
    }, getRealtimeSignal);
};
const getRealtimeSignal = (value, index)=>({
        name: `SIGRT${index + 1}`,
        number: SIGRTMIN + index,
        action: "terminate",
        description: "Application-specific signal (realtime)",
        standard: "posix"
    });
const SIGRTMIN = 34;
const SIGRTMAX = 64;
const SIGNALS = [
    {
        name: "SIGHUP",
        number: 1,
        action: "terminate",
        description: "Terminal closed",
        standard: "posix"
    },
    {
        name: "SIGINT",
        number: 2,
        action: "terminate",
        description: "User interruption with CTRL-C",
        standard: "ansi"
    },
    {
        name: "SIGQUIT",
        number: 3,
        action: "core",
        description: "User interruption with CTRL-\\",
        standard: "posix"
    },
    {
        name: "SIGILL",
        number: 4,
        action: "core",
        description: "Invalid machine instruction",
        standard: "ansi"
    },
    {
        name: "SIGTRAP",
        number: 5,
        action: "core",
        description: "Debugger breakpoint",
        standard: "posix"
    },
    {
        name: "SIGABRT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "ansi"
    },
    {
        name: "SIGIOT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "bsd"
    },
    {
        name: "SIGBUS",
        number: 7,
        action: "core",
        description: "Bus error due to misaligned, non-existing address or paging error",
        standard: "bsd"
    },
    {
        name: "SIGEMT",
        number: 7,
        action: "terminate",
        description: "Command should be emulated but is not implemented",
        standard: "other"
    },
    {
        name: "SIGFPE",
        number: 8,
        action: "core",
        description: "Floating point arithmetic error",
        standard: "ansi"
    },
    {
        name: "SIGKILL",
        number: 9,
        action: "terminate",
        description: "Forced termination",
        standard: "posix",
        forced: true
    },
    {
        name: "SIGUSR1",
        number: 10,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
    },
    {
        name: "SIGSEGV",
        number: 11,
        action: "core",
        description: "Segmentation fault",
        standard: "ansi"
    },
    {
        name: "SIGUSR2",
        number: 12,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
    },
    {
        name: "SIGPIPE",
        number: 13,
        action: "terminate",
        description: "Broken pipe or socket",
        standard: "posix"
    },
    {
        name: "SIGALRM",
        number: 14,
        action: "terminate",
        description: "Timeout or timer",
        standard: "posix"
    },
    {
        name: "SIGTERM",
        number: 15,
        action: "terminate",
        description: "Termination",
        standard: "ansi"
    },
    {
        name: "SIGSTKFLT",
        number: 16,
        action: "terminate",
        description: "Stack is empty or overflowed",
        standard: "other"
    },
    {
        name: "SIGCHLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "posix"
    },
    {
        name: "SIGCLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "other"
    },
    {
        name: "SIGCONT",
        number: 18,
        action: "unpause",
        description: "Unpaused",
        standard: "posix",
        forced: true
    },
    {
        name: "SIGSTOP",
        number: 19,
        action: "pause",
        description: "Paused",
        standard: "posix",
        forced: true
    },
    {
        name: "SIGTSTP",
        number: 20,
        action: "pause",
        description: "Paused using CTRL-Z or \"suspend\"",
        standard: "posix"
    },
    {
        name: "SIGTTIN",
        number: 21,
        action: "pause",
        description: "Background process cannot read terminal input",
        standard: "posix"
    },
    {
        name: "SIGBREAK",
        number: 21,
        action: "terminate",
        description: "User interruption with CTRL-BREAK",
        standard: "other"
    },
    {
        name: "SIGTTOU",
        number: 22,
        action: "pause",
        description: "Background process cannot write to terminal output",
        standard: "posix"
    },
    {
        name: "SIGURG",
        number: 23,
        action: "ignore",
        description: "Socket received out-of-band data",
        standard: "bsd"
    },
    {
        name: "SIGXCPU",
        number: 24,
        action: "core",
        description: "Process timed out",
        standard: "bsd"
    },
    {
        name: "SIGXFSZ",
        number: 25,
        action: "core",
        description: "File too big",
        standard: "bsd"
    },
    {
        name: "SIGVTALRM",
        number: 26,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
    },
    {
        name: "SIGPROF",
        number: 27,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
    },
    {
        name: "SIGWINCH",
        number: 28,
        action: "ignore",
        description: "Terminal window size changed",
        standard: "bsd"
    },
    {
        name: "SIGIO",
        number: 29,
        action: "terminate",
        description: "I/O is available",
        standard: "other"
    },
    {
        name: "SIGPOLL",
        number: 29,
        action: "terminate",
        description: "Watched event",
        standard: "other"
    },
    {
        name: "SIGINFO",
        number: 29,
        action: "ignore",
        description: "Request for process information",
        standard: "other"
    },
    {
        name: "SIGPWR",
        number: 30,
        action: "terminate",
        description: "Device running out of power",
        standard: "systemv"
    },
    {
        name: "SIGSYS",
        number: 31,
        action: "core",
        description: "Invalid system call",
        standard: "other"
    },
    {
        name: "SIGUNUSED",
        number: 31,
        action: "terminate",
        description: "Invalid system call",
        standard: "other"
    }
];
const getSignals = ()=>{
    const realtimeSignals = getRealtimeSignals();
    const signals = [
        ...SIGNALS,
        ...realtimeSignals
    ].map(normalizeSignal);
    return signals;
};
const normalizeSignal = ({ name, number: defaultNumber, description, action, forced = false, standard })=>{
    const { signals: { [name]: constantSignal } } = constants;
    const supported = void 0 !== constantSignal;
    const number = supported ? constantSignal : defaultNumber;
    return {
        name,
        number,
        description,
        supported,
        action,
        forced,
        standard
    };
};
const getSignalsByName = ()=>{
    const signals = getSignals();
    return Object.fromEntries(signals.map(getSignalByName));
};
const getSignalByName = ({ name, number, description, supported, action, forced, standard })=>[
        name,
        {
            name,
            number,
            description,
            supported,
            action,
            forced,
            standard
        }
    ];
const signalsByName = getSignalsByName();
const getSignalsByNumber = ()=>{
    const signals = getSignals();
    const length = SIGRTMAX + 1;
    const signalsA = Array.from({
        length
    }, (value, number)=>getSignalByNumber(number, signals));
    return Object.assign({}, ...signalsA);
};
const getSignalByNumber = (number, signals)=>{
    const signal = findSignalByNumber(number, signals);
    if (void 0 === signal) return {};
    const { name, description, supported, action, forced, standard } = signal;
    return {
        [number]: {
            name,
            number,
            description,
            supported,
            action,
            forced,
            standard
        }
    };
};
const findSignalByNumber = (number, signals)=>{
    const signal = signals.find(({ name })=>constants.signals[name] === number);
    if (void 0 !== signal) return signal;
    return signals.find((signalA)=>signalA.number === number);
};
getSignalsByNumber();
const getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled })=>{
    if (timedOut) return `timed out after ${timeout} milliseconds`;
    if (isCanceled) return 'was canceled';
    if (void 0 !== errorCode) return `failed with ${errorCode}`;
    if (void 0 !== signal) return `was killed with ${signal} (${signalDescription})`;
    if (void 0 !== exitCode) return `failed with exit code ${exitCode}`;
    return 'failed';
};
const makeError = ({ stdout, stderr, all, error, signal, exitCode, command, escapedCommand, timedOut, isCanceled, killed, parsed: { options: { timeout, cwd = node_process.cwd() } } })=>{
    exitCode = null === exitCode ? void 0 : exitCode;
    signal = null === signal ? void 0 : signal;
    const signalDescription = void 0 === signal ? void 0 : signalsByName[signal].description;
    const errorCode = error && error.code;
    const prefix = getErrorPrefix({
        timedOut,
        timeout,
        errorCode,
        signal,
        signalDescription,
        exitCode,
        isCanceled
    });
    const execaMessage = `Command ${prefix}: ${command}`;
    const isError = '[object Error]' === Object.prototype.toString.call(error);
    const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
    const message = [
        shortMessage,
        stderr,
        stdout
    ].filter(Boolean).join('\n');
    if (isError) {
        error.originalMessage = error.message;
        error.message = message;
    } else error = new Error(message);
    error.shortMessage = shortMessage;
    error.command = command;
    error.escapedCommand = escapedCommand;
    error.exitCode = exitCode;
    error.signal = signal;
    error.signalDescription = signalDescription;
    error.stdout = stdout;
    error.stderr = stderr;
    error.cwd = cwd;
    if (void 0 !== all) error.all = all;
    if ('bufferedData' in error) delete error.bufferedData;
    error.failed = true;
    error.timedOut = Boolean(timedOut);
    error.isCanceled = isCanceled;
    error.killed = killed && !timedOut;
    return error;
};
const aliases = [
    'stdin',
    'stdout',
    'stderr'
];
const hasAlias = (options)=>aliases.some((alias)=>void 0 !== options[alias]);
const normalizeStdio = (options)=>{
    if (!options) return;
    const { stdio } = options;
    if (void 0 === stdio) return aliases.map((alias)=>options[alias]);
    if (hasAlias(options)) throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias)=>`\`${alias}\``).join(', ')}`);
    if ('string' == typeof stdio) return stdio;
    if (!Array.isArray(stdio)) throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
    const length = Math.max(stdio.length, aliases.length);
    return Array.from({
        length
    }, (value, index)=>stdio[index]);
};
const signals_signals = [];
signals_signals.push('SIGHUP', 'SIGINT', 'SIGTERM');
if ('win32' !== process.platform) signals_signals.push('SIGALRM', 'SIGABRT', 'SIGVTALRM', 'SIGXCPU', 'SIGXFSZ', 'SIGUSR2', 'SIGTRAP', 'SIGSYS', 'SIGQUIT', 'SIGIOT');
if ('linux' === process.platform) signals_signals.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT');
const processOk = (process1)=>!!process1 && 'object' == typeof process1 && 'function' == typeof process1.removeListener && 'function' == typeof process1.emit && 'function' == typeof process1.reallyExit && 'function' == typeof process1.listeners && 'function' == typeof process1.kill && 'number' == typeof process1.pid && 'function' == typeof process1.on;
const kExitEmitter = Symbol.for('signal-exit emitter');
const src_global = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);
class Emitter {
    emitted = {
        afterExit: false,
        exit: false
    };
    listeners = {
        afterExit: [],
        exit: []
    };
    count = 0;
    id = Math.random();
    constructor(){
        if (src_global[kExitEmitter]) return src_global[kExitEmitter];
        ObjectDefineProperty(src_global, kExitEmitter, {
            value: this,
            writable: false,
            enumerable: false,
            configurable: false
        });
    }
    on(ev, fn) {
        this.listeners[ev].push(fn);
    }
    removeListener(ev, fn) {
        const list = this.listeners[ev];
        const i = list.indexOf(fn);
        if (-1 === i) return;
        if (0 === i && 1 === list.length) list.length = 0;
        else list.splice(i, 1);
    }
    emit(ev, code, signal) {
        if (this.emitted[ev]) return false;
        this.emitted[ev] = true;
        let ret = false;
        for (const fn of this.listeners[ev])ret = true === fn(code, signal) || ret;
        if ('exit' === ev) ret = this.emit('afterExit', code, signal) || ret;
        return ret;
    }
}
class SignalExitBase {
}
const signalExitWrap = (handler)=>({
        onExit (cb, opts) {
            return handler.onExit(cb, opts);
        },
        load () {
            return handler.load();
        },
        unload () {
            return handler.unload();
        }
    });
class SignalExitFallback extends SignalExitBase {
    onExit() {
        return ()=>{};
    }
    load() {}
    unload() {}
}
class SignalExit extends SignalExitBase {
    #hupSig = 'win32' === mjs_process.platform ? 'SIGINT' : 'SIGHUP';
    #emitter = new Emitter();
    #process;
    #originalProcessEmit;
    #originalProcessReallyExit;
    #sigListeners = {};
    #loaded = false;
    constructor(process1){
        super();
        this.#process = process1;
        this.#sigListeners = {};
        for (const sig of signals_signals)this.#sigListeners[sig] = ()=>{
            const listeners = this.#process.listeners(sig);
            let { count } = this.#emitter;
            const p = process1;
            if ('object' == typeof p.__signal_exit_emitter__ && 'number' == typeof p.__signal_exit_emitter__.count) count += p.__signal_exit_emitter__.count;
            if (listeners.length === count) {
                this.unload();
                const ret = this.#emitter.emit('exit', null, sig);
                const s = 'SIGHUP' === sig ? this.#hupSig : sig;
                if (!ret) process1.kill(process1.pid, s);
            }
        };
        this.#originalProcessReallyExit = process1.reallyExit;
        this.#originalProcessEmit = process1.emit;
    }
    onExit(cb, opts) {
        if (!processOk(this.#process)) return ()=>{};
        if (false === this.#loaded) this.load();
        const ev = opts?.alwaysLast ? 'afterExit' : 'exit';
        this.#emitter.on(ev, cb);
        return ()=>{
            this.#emitter.removeListener(ev, cb);
            if (0 === this.#emitter.listeners['exit'].length && 0 === this.#emitter.listeners['afterExit'].length) this.unload();
        };
    }
    load() {
        if (this.#loaded) return;
        this.#loaded = true;
        this.#emitter.count += 1;
        for (const sig of signals_signals)try {
            const fn = this.#sigListeners[sig];
            if (fn) this.#process.on(sig, fn);
        } catch (_) {}
        this.#process.emit = (ev, ...a)=>this.#processEmit(ev, ...a);
        this.#process.reallyExit = (code)=>this.#processReallyExit(code);
    }
    unload() {
        if (!this.#loaded) return;
        this.#loaded = false;
        signals_signals.forEach((sig)=>{
            const listener = this.#sigListeners[sig];
            if (!listener) throw new Error('Listener not defined for signal: ' + sig);
            try {
                this.#process.removeListener(sig, listener);
            } catch (_) {}
        });
        this.#process.emit = this.#originalProcessEmit;
        this.#process.reallyExit = this.#originalProcessReallyExit;
        this.#emitter.count -= 1;
    }
    #processReallyExit(code) {
        if (!processOk(this.#process)) return 0;
        this.#process.exitCode = code || 0;
        this.#emitter.emit('exit', this.#process.exitCode, null);
        return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
    }
    #processEmit(ev, ...args) {
        const og = this.#originalProcessEmit;
        if (!('exit' === ev && processOk(this.#process))) return og.call(this.#process, ev, ...args);
        {
            if ('number' == typeof args[0]) this.#process.exitCode = args[0];
            const ret = og.call(this.#process, ev, ...args);
            this.#emitter.emit('exit', this.#process.exitCode, null);
            return ret;
        }
    }
}
const mjs_process = globalThis.process;
const { onExit, load, unload } = signalExitWrap(processOk(mjs_process) ? new SignalExit(mjs_process) : new SignalExitFallback());
const DEFAULT_FORCE_KILL_TIMEOUT = 5000;
const spawnedKill = (kill, signal = 'SIGTERM', options = {})=>{
    const killResult = kill(signal);
    setKillTimeout(kill, signal, options, killResult);
    return killResult;
};
const setKillTimeout = (kill, signal, options, killResult)=>{
    if (!shouldForceKill(signal, options, killResult)) return;
    const timeout = getForceKillAfterTimeout(options);
    const t = setTimeout(()=>{
        kill('SIGKILL');
    }, timeout);
    if (t.unref) t.unref();
};
const shouldForceKill = (signal, { forceKillAfterTimeout }, killResult)=>isSigterm(signal) && false !== forceKillAfterTimeout && killResult;
const isSigterm = (signal)=>signal === node_os.constants.signals.SIGTERM || 'string' == typeof signal && 'SIGTERM' === signal.toUpperCase();
const getForceKillAfterTimeout = ({ forceKillAfterTimeout = true })=>{
    if (true === forceKillAfterTimeout) return DEFAULT_FORCE_KILL_TIMEOUT;
    if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
    return forceKillAfterTimeout;
};
const spawnedCancel = (spawned, context)=>{
    const killResult = spawned.kill();
    if (killResult) context.isCanceled = true;
};
const timeoutKill = (spawned, signal, reject)=>{
    spawned.kill(signal);
    reject(Object.assign(new Error('Timed out'), {
        timedOut: true,
        signal
    }));
};
const setupTimeout = (spawned, { timeout, killSignal = 'SIGTERM' }, spawnedPromise)=>{
    if (0 === timeout || void 0 === timeout) return spawnedPromise;
    let timeoutId;
    const timeoutPromise = new Promise((resolve, reject)=>{
        timeoutId = setTimeout(()=>{
            timeoutKill(spawned, killSignal, reject);
        }, timeout);
    });
    const safeSpawnedPromise = spawnedPromise.finally(()=>{
        clearTimeout(timeoutId);
    });
    return Promise.race([
        timeoutPromise,
        safeSpawnedPromise
    ]);
};
const validateTimeout = ({ timeout })=>{
    if (void 0 !== timeout && (!Number.isFinite(timeout) || timeout < 0)) throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
};
const setExitHandler = async (spawned, { cleanup, detached }, timedPromise)=>{
    if (!cleanup || detached) return timedPromise;
    const removeExitHandler = onExit(()=>{
        spawned.kill();
    });
    return timedPromise.finally(()=>{
        removeExitHandler();
    });
};
function isStream(stream) {
    return null !== stream && 'object' == typeof stream && 'function' == typeof stream.pipe;
}
function isWritableStream(stream) {
    return isStream(stream) && false !== stream.writable && 'function' == typeof stream._write && 'object' == typeof stream._writableState;
}
const isExecaChildProcess = (target)=>target instanceof ChildProcess && 'function' == typeof target.then;
const pipeToTarget = (spawned, streamName, target)=>{
    if ('string' == typeof target) {
        spawned[streamName].pipe(createWriteStream(target));
        return spawned;
    }
    if (isWritableStream(target)) {
        spawned[streamName].pipe(target);
        return spawned;
    }
    if (!isExecaChildProcess(target)) throw new TypeError('The second argument must be a string, a stream or an Execa child process.');
    if (!isWritableStream(target.stdin)) throw new TypeError('The target child process\'s stdin must be available.');
    spawned[streamName].pipe(target.stdin);
    return target;
};
const addPipeMethods = (spawned)=>{
    if (null !== spawned.stdout) spawned.pipeStdout = pipeToTarget.bind(void 0, spawned, 'stdout');
    if (null !== spawned.stderr) spawned.pipeStderr = pipeToTarget.bind(void 0, spawned, 'stderr');
    if (void 0 !== spawned.all) spawned.pipeAll = pipeToTarget.bind(void 0, spawned, 'all');
};
const contents_getStreamContents = async (stream, { init, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {})=>{
    if (!isAsyncIterable(stream)) throw new Error('The first argument must be a Readable, a ReadableStream, or an async iterable.');
    const state = init();
    state.length = 0;
    try {
        for await (const chunk of stream){
            const chunkType = getChunkType(chunk);
            const convertedChunk = convertChunk[chunkType](chunk, state);
            appendChunk({
                convertedChunk,
                state,
                getSize,
                truncateChunk,
                addChunk,
                maxBuffer
            });
        }
        appendFinalChunk({
            state,
            convertChunk,
            getSize,
            truncateChunk,
            addChunk,
            getFinalChunk,
            maxBuffer
        });
        return finalize(state);
    } catch (error) {
        error.bufferedData = finalize(state);
        throw error;
    }
};
const appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer })=>{
    const convertedChunk = getFinalChunk(state);
    if (void 0 !== convertedChunk) appendChunk({
        convertedChunk,
        state,
        getSize,
        truncateChunk,
        addChunk,
        maxBuffer
    });
};
const appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer })=>{
    const chunkSize = getSize(convertedChunk);
    const newLength = state.length + chunkSize;
    if (newLength <= maxBuffer) return void addNewChunk(convertedChunk, state, addChunk, newLength);
    const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
    if (void 0 !== truncatedChunk) addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
    throw new MaxBufferError();
};
const addNewChunk = (convertedChunk, state, addChunk, newLength)=>{
    state.contents = addChunk(convertedChunk, state, newLength);
    state.length = newLength;
};
const isAsyncIterable = (stream)=>'object' == typeof stream && null !== stream && 'function' == typeof stream[Symbol.asyncIterator];
const getChunkType = (chunk)=>{
    const typeOfChunk = typeof chunk;
    if ('string' === typeOfChunk) return 'string';
    if ('object' !== typeOfChunk || null === chunk) return 'others';
    if (globalThis.Buffer?.isBuffer(chunk)) return 'buffer';
    const prototypeName = objectToString.call(chunk);
    if ('[object ArrayBuffer]' === prototypeName) return 'arrayBuffer';
    if ('[object DataView]' === prototypeName) return 'dataView';
    if (Number.isInteger(chunk.byteLength) && Number.isInteger(chunk.byteOffset) && '[object ArrayBuffer]' === objectToString.call(chunk.buffer)) return 'typedArray';
    return 'others';
};
const { toString: objectToString } = Object.prototype;
class MaxBufferError extends Error {
    name = 'MaxBufferError';
    constructor(){
        super('maxBuffer exceeded');
    }
}
const utils_identity = (value)=>value;
const utils_noop = ()=>void 0;
const utils_getContentsProp = ({ contents })=>contents;
const throwObjectStream = (chunk)=>{
    throw new Error(`Streams in object mode are not supported: ${String(chunk)}`);
};
const getLengthProp = (convertedChunk)=>convertedChunk.length;
async function getStreamAsArrayBuffer(stream, options) {
    return contents_getStreamContents(stream, arrayBufferMethods, options);
}
const initArrayBuffer = ()=>({
        contents: new ArrayBuffer(0)
    });
const useTextEncoder = (chunk)=>textEncoder.encode(chunk);
const textEncoder = new TextEncoder();
const useUint8Array = (chunk)=>new Uint8Array(chunk);
const useUint8ArrayWithOffset = (chunk)=>new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
const truncateArrayBufferChunk = (convertedChunk, chunkSize)=>convertedChunk.slice(0, chunkSize);
const addArrayBufferChunk = (convertedChunk, { contents, length: previousLength }, length)=>{
    const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
    new Uint8Array(newContents).set(convertedChunk, previousLength);
    return newContents;
};
const resizeArrayBufferSlow = (contents, length)=>{
    if (length <= contents.byteLength) return contents;
    const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
    new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
    return arrayBuffer;
};
const resizeArrayBuffer = (contents, length)=>{
    if (length <= contents.maxByteLength) {
        contents.resize(length);
        return contents;
    }
    const arrayBuffer = new ArrayBuffer(length, {
        maxByteLength: getNewContentsLength(length)
    });
    new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
    return arrayBuffer;
};
const getNewContentsLength = (length)=>SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));
const SCALE_FACTOR = 2;
const finalizeArrayBuffer = ({ contents, length })=>hasArrayBufferResize() ? contents : contents.slice(0, length);
const hasArrayBufferResize = ()=>'resize' in ArrayBuffer.prototype;
const arrayBufferMethods = {
    init: initArrayBuffer,
    convertChunk: {
        string: useTextEncoder,
        buffer: useUint8Array,
        arrayBuffer: useUint8Array,
        dataView: useUint8ArrayWithOffset,
        typedArray: useUint8ArrayWithOffset,
        others: throwObjectStream
    },
    getSize: getLengthProp,
    truncateChunk: truncateArrayBufferChunk,
    addChunk: addArrayBufferChunk,
    getFinalChunk: utils_noop,
    finalize: finalizeArrayBuffer
};
async function getStreamAsBuffer(stream, options) {
    if (!('Buffer' in globalThis)) throw new Error('getStreamAsBuffer() is only supported in Node.js');
    try {
        return arrayBufferToNodeBuffer(await getStreamAsArrayBuffer(stream, options));
    } catch (error) {
        if (void 0 !== error.bufferedData) error.bufferedData = arrayBufferToNodeBuffer(error.bufferedData);
        throw error;
    }
}
const arrayBufferToNodeBuffer = (arrayBuffer)=>globalThis.Buffer.from(arrayBuffer);
async function getStreamAsString(stream, options) {
    return contents_getStreamContents(stream, stringMethods, options);
}
const initString = ()=>({
        contents: '',
        textDecoder: new TextDecoder()
    });
const useTextDecoder = (chunk, { textDecoder })=>textDecoder.decode(chunk, {
        stream: true
    });
const addStringChunk = (convertedChunk, { contents })=>contents + convertedChunk;
const truncateStringChunk = (convertedChunk, chunkSize)=>convertedChunk.slice(0, chunkSize);
const getFinalStringChunk = ({ textDecoder })=>{
    const finalChunk = textDecoder.decode();
    return '' === finalChunk ? void 0 : finalChunk;
};
const stringMethods = {
    init: initString,
    convertChunk: {
        string: utils_identity,
        buffer: useTextDecoder,
        arrayBuffer: useTextDecoder,
        dataView: useTextDecoder,
        typedArray: useTextDecoder,
        others: throwObjectStream
    },
    getSize: getLengthProp,
    truncateChunk: truncateStringChunk,
    addChunk: addStringChunk,
    getFinalChunk: getFinalStringChunk,
    finalize: utils_getContentsProp
};
var merge_stream = __webpack_require__("../../node_modules/.pnpm/merge-stream@2.0.0/node_modules/merge-stream/index.js");
const validateInputOptions = (input)=>{
    if (void 0 !== input) throw new TypeError('The `input` and `inputFile` options cannot be both set.');
};
const getInputSync = ({ input, inputFile })=>{
    if ('string' != typeof inputFile) return input;
    validateInputOptions(input);
    return readFileSync(inputFile);
};
const handleInputSync = (options)=>{
    const input = getInputSync(options);
    if (isStream(input)) throw new TypeError('The `input` option cannot be a stream in sync mode');
    return input;
};
const getInput = ({ input, inputFile })=>{
    if ('string' != typeof inputFile) return input;
    validateInputOptions(input);
    return createReadStream(inputFile);
};
const handleInput = (spawned, options)=>{
    const input = getInput(options);
    if (void 0 === input) return;
    if (isStream(input)) input.pipe(spawned.stdin);
    else spawned.stdin.end(input);
};
const makeAllStream = (spawned, { all })=>{
    if (!all || !spawned.stdout && !spawned.stderr) return;
    const mixed = merge_stream();
    if (spawned.stdout) mixed.add(spawned.stdout);
    if (spawned.stderr) mixed.add(spawned.stderr);
    return mixed;
};
const getBufferedData = async (stream, streamPromise)=>{
    if (!stream || void 0 === streamPromise) return;
    await promises_setTimeout(0);
    stream.destroy();
    try {
        return await streamPromise;
    } catch (error) {
        return error.bufferedData;
    }
};
const getStreamPromise = (stream, { encoding, buffer, maxBuffer })=>{
    if (!stream || !buffer) return;
    if ('utf8' === encoding || 'utf-8' === encoding) return getStreamAsString(stream, {
        maxBuffer
    });
    if (null === encoding || 'buffer' === encoding) return getStreamAsBuffer(stream, {
        maxBuffer
    });
    return applyEncoding(stream, maxBuffer, encoding);
};
const applyEncoding = async (stream, maxBuffer, encoding)=>{
    const buffer = await getStreamAsBuffer(stream, {
        maxBuffer
    });
    return buffer.toString(encoding);
};
const getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone)=>{
    const stdoutPromise = getStreamPromise(stdout, {
        encoding,
        buffer,
        maxBuffer
    });
    const stderrPromise = getStreamPromise(stderr, {
        encoding,
        buffer,
        maxBuffer
    });
    const allPromise = getStreamPromise(all, {
        encoding,
        buffer,
        maxBuffer: 2 * maxBuffer
    });
    try {
        return await Promise.all([
            processDone,
            stdoutPromise,
            stderrPromise,
            allPromise
        ]);
    } catch (error) {
        return Promise.all([
            {
                error,
                signal: error.signal,
                timedOut: error.timedOut
            },
            getBufferedData(stdout, stdoutPromise),
            getBufferedData(stderr, stderrPromise),
            getBufferedData(all, allPromise)
        ]);
    }
};
const nativePromisePrototype = (async ()=>{})().constructor.prototype;
const descriptors = [
    'then',
    'catch',
    'finally'
].map((property)=>[
        property,
        Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
    ]);
const mergePromise = (spawned, promise)=>{
    for (const [property, descriptor] of descriptors){
        const value = 'function' == typeof promise ? (...args)=>Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
        Reflect.defineProperty(spawned, property, {
            ...descriptor,
            value
        });
    }
};
const getSpawnedPromise = (spawned)=>new Promise((resolve, reject)=>{
        spawned.on('exit', (exitCode, signal)=>{
            resolve({
                exitCode,
                signal
            });
        });
        spawned.on('error', (error)=>{
            reject(error);
        });
        if (spawned.stdin) spawned.stdin.on('error', (error)=>{
            reject(error);
        });
    });
const normalizeArgs = (file, args = [])=>{
    if (!Array.isArray(args)) return [
        file
    ];
    return [
        file,
        ...args
    ];
};
const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const escapeArg = (arg)=>{
    if ('string' != typeof arg || NO_ESCAPE_REGEXP.test(arg)) return arg;
    return `"${arg.replaceAll('"', '\\"')}"`;
};
const joinCommand = (file, args)=>normalizeArgs(file, args).join(' ');
const getEscapedCommand = (file, args)=>normalizeArgs(file, args).map((arg)=>escapeArg(arg)).join(' ');
const SPACES_REGEXP = / +/g;
const parseExpression = (expression)=>{
    const typeOfExpression = typeof expression;
    if ('string' === typeOfExpression) return expression;
    if ('number' === typeOfExpression) return String(expression);
    if ('object' === typeOfExpression && null !== expression && !(expression instanceof ChildProcess) && 'stdout' in expression) {
        const typeOfStdout = typeof expression.stdout;
        if ('string' === typeOfStdout) return expression.stdout;
        if (Buffer.isBuffer(expression.stdout)) return expression.stdout.toString();
        throw new TypeError(`Unexpected "${typeOfStdout}" stdout in template expression`);
    }
    throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
};
const concatTokens = (tokens, nextTokens, isNew)=>isNew || 0 === tokens.length || 0 === nextTokens.length ? [
        ...tokens,
        ...nextTokens
    ] : [
        ...tokens.slice(0, -1),
        `${tokens.at(-1)}${nextTokens[0]}`,
        ...nextTokens.slice(1)
    ];
const parseTemplate = ({ templates, expressions, tokens, index, template })=>{
    const templateString = template ?? templates.raw[index];
    const templateTokens = templateString.split(SPACES_REGEXP).filter(Boolean);
    const newTokens = concatTokens(tokens, templateTokens, templateString.startsWith(' '));
    if (index === expressions.length) return newTokens;
    const expression = expressions[index];
    const expressionTokens = Array.isArray(expression) ? expression.map((expression)=>parseExpression(expression)) : [
        parseExpression(expression)
    ];
    return concatTokens(newTokens, expressionTokens, templateString.endsWith(' '));
};
const parseTemplates = (templates, expressions)=>{
    let tokens = [];
    for (const [index, template] of templates.entries())tokens = parseTemplate({
        templates,
        expressions,
        tokens,
        index,
        template
    });
    return tokens;
};
const verboseDefault = debuglog('execa').enabled;
const padField = (field, padding)=>String(field).padStart(padding, '0');
const getTimestamp = ()=>{
    const date = new Date();
    return `${padField(date.getHours(), 2)}:${padField(date.getMinutes(), 2)}:${padField(date.getSeconds(), 2)}.${padField(date.getMilliseconds(), 3)}`;
};
const logCommand = (escapedCommand, { verbose })=>{
    if (!verbose) return;
    node_process.stderr.write(`[${getTimestamp()}] ${escapedCommand}\n`);
};
const DEFAULT_MAX_BUFFER = 100000000;
const getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath })=>{
    const env = extendEnv ? {
        ...node_process.env,
        ...envOption
    } : envOption;
    if (preferLocal) return npmRunPathEnv({
        env,
        cwd: localDir,
        execPath
    });
    return env;
};
const handleArguments = (file, args, options = {})=>{
    const parsed = cross_spawn._parse(file, args, options);
    file = parsed.command;
    args = parsed.args;
    options = parsed.options;
    options = {
        maxBuffer: DEFAULT_MAX_BUFFER,
        buffer: true,
        stripFinalNewline: true,
        extendEnv: true,
        preferLocal: false,
        localDir: options.cwd || node_process.cwd(),
        execPath: node_process.execPath,
        encoding: 'utf8',
        reject: true,
        cleanup: true,
        all: false,
        windowsHide: true,
        verbose: verboseDefault,
        ...options
    };
    options.env = getEnv(options);
    options.stdio = normalizeStdio(options);
    if ('win32' === node_process.platform && 'cmd' === node_path.basename(file, '.exe')) args.unshift('/q');
    return {
        file,
        args,
        options,
        parsed
    };
};
const handleOutput = (options, value, error)=>{
    if ('string' != typeof value && !Buffer.isBuffer(value)) return void 0 === error ? void 0 : '';
    if (options.stripFinalNewline) return stripFinalNewline(value);
    return value;
};
function execa(file, args, options) {
    const parsed = handleArguments(file, args, options);
    const command = joinCommand(file, args);
    const escapedCommand = getEscapedCommand(file, args);
    logCommand(escapedCommand, parsed.options);
    validateTimeout(parsed.options);
    let spawned;
    try {
        spawned = node_child_process.spawn(parsed.file, parsed.args, parsed.options);
    } catch (error) {
        const dummySpawned = new node_child_process.ChildProcess();
        const errorPromise = Promise.reject(makeError({
            error,
            stdout: '',
            stderr: '',
            all: '',
            command,
            escapedCommand,
            parsed,
            timedOut: false,
            isCanceled: false,
            killed: false
        }));
        mergePromise(dummySpawned, errorPromise);
        return dummySpawned;
    }
    const spawnedPromise = getSpawnedPromise(spawned);
    const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
    const processDone = setExitHandler(spawned, parsed.options, timedPromise);
    const context = {
        isCanceled: false
    };
    spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
    spawned.cancel = spawnedCancel.bind(null, spawned, context);
    const handlePromise = async ()=>{
        const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
        const stdout = handleOutput(parsed.options, stdoutResult);
        const stderr = handleOutput(parsed.options, stderrResult);
        const all = handleOutput(parsed.options, allResult);
        if (error || 0 !== exitCode || null !== signal) {
            const returnedError = makeError({
                error,
                exitCode,
                signal,
                stdout,
                stderr,
                all,
                command,
                escapedCommand,
                parsed,
                timedOut,
                isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
                killed: spawned.killed
            });
            if (!parsed.options.reject) return returnedError;
            throw returnedError;
        }
        return {
            command,
            escapedCommand,
            exitCode: 0,
            stdout,
            stderr,
            all,
            failed: false,
            timedOut: false,
            isCanceled: false,
            killed: false
        };
    };
    const handlePromiseOnce = node_modules_onetime(handlePromise);
    handleInput(spawned, parsed.options);
    spawned.all = makeAllStream(spawned, parsed.options);
    addPipeMethods(spawned);
    mergePromise(spawned, handlePromiseOnce);
    return spawned;
}
function execaSync(file, args, options) {
    const parsed = handleArguments(file, args, options);
    const command = joinCommand(file, args);
    const escapedCommand = getEscapedCommand(file, args);
    logCommand(escapedCommand, parsed.options);
    const input = handleInputSync(parsed.options);
    let result;
    try {
        result = node_child_process.spawnSync(parsed.file, parsed.args, {
            ...parsed.options,
            input
        });
    } catch (error) {
        throw makeError({
            error,
            stdout: '',
            stderr: '',
            all: '',
            command,
            escapedCommand,
            parsed,
            timedOut: false,
            isCanceled: false,
            killed: false
        });
    }
    const stdout = handleOutput(parsed.options, result.stdout, result.error);
    const stderr = handleOutput(parsed.options, result.stderr, result.error);
    if (result.error || 0 !== result.status || null !== result.signal) {
        const error = makeError({
            stdout,
            stderr,
            error: result.error,
            signal: result.signal,
            exitCode: result.status,
            command,
            escapedCommand,
            parsed,
            timedOut: result.error && 'ETIMEDOUT' === result.error.code,
            isCanceled: false,
            killed: null !== result.signal
        });
        if (!parsed.options.reject) return error;
        throw error;
    }
    return {
        command,
        escapedCommand,
        exitCode: 0,
        stdout,
        stderr,
        failed: false,
        timedOut: false,
        isCanceled: false,
        killed: false
    };
}
const normalizeScriptStdin = ({ input, inputFile, stdio })=>void 0 === input && void 0 === inputFile && void 0 === stdio ? {
        stdin: 'inherit'
    } : {};
const normalizeScriptOptions = (options = {})=>({
        preferLocal: true,
        ...normalizeScriptStdin(options),
        ...options
    });
function create$(options) {
    function $(templatesOrOptions, ...expressions) {
        if (!Array.isArray(templatesOrOptions)) return create$({
            ...options,
            ...templatesOrOptions
        });
        const [file, ...args] = parseTemplates(templatesOrOptions, expressions);
        return execa(file, args, normalizeScriptOptions(options));
    }
    $.sync = (templates, ...expressions)=>{
        if (!Array.isArray(templates)) throw new TypeError('Please use $(options).sync`command` instead of $.sync(options)`command`.');
        const [file, ...args] = parseTemplates(templates, expressions);
        return execaSync(file, args, normalizeScriptOptions(options));
    };
    return $;
}
create$();
function transform(timestamp, lang) {
    return new Date(timestamp).toLocaleString(lang || 'zh');
}
async function getGitLastUpdatedTimeStamp(filePath) {
    let lastUpdated;
    try {
        const { stdout } = await execa('git', [
            'log',
            '-1',
            '--format=%at',
            filePath
        ]);
        lastUpdated = 1000 * Number(stdout);
    } catch (_e) {}
    return lastUpdated;
}
function pluginLastUpdated() {
    return {
        name: '@rspress/plugin-last-updated',
        async extendPageData (pageData) {
            const { _filepath, lang } = pageData;
            const lastUpdated = await getGitLastUpdatedTimeStamp(_filepath);
            if (lastUpdated) pageData.lastUpdatedTime = transform(lastUpdated, lang);
        }
    };
}
export { pluginLastUpdated };
