import {useState, useEffect} from 'react';

type ChangeableProperty = 'color' | 'background-color';

const insertStyleSheetRule = (ruleText: string): void => {
    const sheets = document.styleSheets;

    if (sheets.length === 0) {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
    }

    const sheet = sheets[sheets.length - 1];
    // @ts-ignore
    sheet.insertRule(
        ruleText,
        // @ts-ignore
        sheet.rules ? sheet.rules.length : sheet.cssRules.length
    );
};

const makeAnimation = (color: string, property: ChangeableProperty): string => {
    const random = 'use-color-change' + String(Math.random()).replace(/\./g, '');
    const animation = `@keyframes ${random} { from {${property}: ${color};} to {} }`;
    insertStyleSheetRule(animation);
    return random;
};

const useColorChange = (
    value: number,
    options: {
        higher: string | null;
        lower: string | null;
        duration?: number;
        property?: ChangeableProperty;
    }
): {animation?: string} => {
    const [val, setVal] = useState(value);
    const [animation, setAnimation] = useState('');

    const duration = options.duration || 1800;
    const property = options.property || 'color';

    useEffect(() => {
        if (value > val && options.higher) {
            setAnimation(makeAnimation(options.higher, property));
        } else if (value < val && options.lower) {
            setAnimation(makeAnimation(options.lower, property));
        }
        setVal(value);
    }, [duration, property, options.higher, options.lower, val, value]);

    if (!animation) {
        return {};
    }

    return {
        animation: `${animation} ${duration / 1000}s`
    };
};

export default useColorChange;
