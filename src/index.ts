import {useState, useEffect} from 'react';

type ChangeableProperty = 'color' | 'background-color';

const USE_COLOR_CHANGE_ID = '__use_color_change';

const insertStyleSheetRule = (ruleText: string): void => {
    let style = document.getElementById(USE_COLOR_CHANGE_ID) as HTMLStyleElement | null
    if (style == null) {
      style = document.createElement('style');
      style.setAttribute('id', USE_COLOR_CHANGE_ID)
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
    }

    const { sheet } = style;
    sheet?.insertRule(
        ruleText,
        sheet.rules ? sheet.rules.length : sheet.cssRules.length
    );
};

const makeAnimation = (color: string, property: ChangeableProperty): string => {
    const random =
        'use-color-change' + String(Math.random()).replace(/\./g, '');
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
