import { Component } from 'react';
import { HTMLAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';
import { default as MonacoEditor } from '@monaco-editor/react';
import { loader as MonacoEditorLoader } from '@monaco-editor/react';
import { EditorProps as MonacoEditorProps } from '@monaco-editor/react';
import { default as React_2 } from 'react';
import { ReactElement } from 'react';

export declare function Editor(props: EditorProps): JSX.Element;

declare type EditorProps = Partial<MonacoEditorProps>;

export { MonacoEditor }

export { MonacoEditorLoader }

export { MonacoEditorProps }

export declare class Runner extends Component<RunnerProps, RunnerState> {
    static getDerivedStateFromError(error: Error): {
        error: Error;
        comp: null;
    };
    timer: number | null;
    constructor(props: RunnerProps);
    waitCompile(targetCode: string): void;
    doCompile(targetCode: string): Promise<void>;
    componentDidCatch(error: Error, errorInfo: React_2.ErrorInfo): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: RunnerProps): void;
    render(): JSX.Element;
}

declare interface RunnerProps extends HTMLAttributes<HTMLDivElement> {
    code: string;
    language: string;
    getImport: (name: string, getDefault?: boolean) => void;
}

declare interface RunnerState {
    error?: Error;
    comp: ReactElement | null;
}

export { }
