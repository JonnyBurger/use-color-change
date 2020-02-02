import {useState, useEffect} from 'react';

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

const makeAnimation = (color: string): string => {
    const random =
        'use-color-change' + String(Math.random()).replace(/\./g, '');
    const animation = `@keyframes ${random} { from {color: ${color};} to {} }`;
    insertStyleSheetRule(animation);
    return random;
};

const useColorChange = (
    value: number,
    options: {
        higher: string | null;
        lower: string | null;
        duration?: number;
    }
): {animation?: string} => {
    const [val, setVal] = useState(value);
    const [animation, setAnimation] = useState();

    const duration = options.duration || 1800;

    useEffect(() => {
        if (value > val && options.higher) {
            setAnimation(makeAnimation(options.higher));
        } else if (value < val && options.lower) {
            setAnimation(makeAnimation(options.lower));
        }
        setVal(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration, options.higher, options.lower, val, value]);

    if (!animation) {
        return {};
    }

    return {
        animation: `${animation} ${duration / 1000}s`
    };
};

export default useColorChange;
