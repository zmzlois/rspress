import { jsx, jsxs } from "react/jsx-runtime";
import { Tab, Tabs } from "@theme";
import { PreWithCodeButtonGroup } from "../../layout/DocLayout/docComponents/pre.js";
import { Bun } from "./icons/Bun.js";
import { Npm } from "./icons/Npm.js";
import { Pnpm } from "./icons/Pnpm.js";
import { Yarn } from "./icons/Yarn.js";
import "./index.css";
function normalizeCommand(command) {
    if (command.startsWith('yarn create')) return command.replace(/(yarn create [^\s]+)@latest/, '$1');
    if (!command?.includes('install')) return command;
    const pureCommand = command.split(' ').filter((item)=>!item.startsWith('-') && !item.startsWith('--')).join(' ');
    if ('yarn install' === pureCommand || 'bun install' === pureCommand) return command;
    return command.replace('install', 'add');
}
function splitTo2Parts(command) {
    const parts = command.split(' ');
    const firstPart = parts[0];
    const secondPart = command.slice(firstPart.length);
    return [
        firstPart,
        secondPart
    ];
}
function PackageManagerTabs({ command, additionalTabs = [] }) {
    let commandInfo;
    const packageMangerToIcon = {
        npm: /*#__PURE__*/ jsx(Npm, {}),
        yarn: /*#__PURE__*/ jsx(Yarn, {}),
        pnpm: /*#__PURE__*/ jsx(Pnpm, {}),
        bun: /*#__PURE__*/ jsx(Bun, {})
    };
    additionalTabs.forEach((tab)=>{
        packageMangerToIcon[tab.tool] = tab.icon;
    });
    if ('string' == typeof command) {
        commandInfo = {
            npm: `npm ${command}`,
            yarn: `yarn ${command}`,
            pnpm: `pnpm ${command}`,
            bun: `bun ${command}`
        };
        additionalTabs.forEach((tab)=>{
            commandInfo[tab.tool] = `${tab.tool} ${command}`;
        });
    } else commandInfo = command;
    commandInfo.yarn && (commandInfo.yarn = normalizeCommand(commandInfo.yarn));
    commandInfo.bun && (commandInfo.bun = normalizeCommand(commandInfo.bun));
    return /*#__PURE__*/ jsx(Tabs, {
        groupId: "package.manager",
        values: Object.entries(commandInfo).map(([key])=>/*#__PURE__*/ jsxs("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 15
                },
                children: [
                    packageMangerToIcon[key],
                    /*#__PURE__*/ jsx("span", {
                        style: {
                            marginLeft: 6,
                            marginBottom: 2
                        },
                        children: key
                    })
                ]
            }, key)),
        children: Object.entries(commandInfo).map(([key, value])=>{
            const [packageManager, command] = splitTo2Parts(value);
            return /*#__PURE__*/ jsx(Tab, {
                children: /*#__PURE__*/ jsx(PreWithCodeButtonGroup, {
                    children: /*#__PURE__*/ jsx("code", {
                        className: "language-bash",
                        style: {
                            whiteSpace: 'pre'
                        },
                        children: /*#__PURE__*/ jsxs("span", {
                            style: {
                                display: 'block',
                                padding: '0px 1.25rem'
                            },
                            children: [
                                /*#__PURE__*/ jsx("span", {
                                    style: {
                                        color: 'var(--shiki-token-function)'
                                    },
                                    children: packageManager
                                }),
                                /*#__PURE__*/ jsx("span", {
                                    style: {
                                        color: 'var(--shiki-token-string)'
                                    },
                                    children: command
                                })
                            ]
                        })
                    })
                })
            }, key);
        })
    });
}
export { PackageManagerTabs };
