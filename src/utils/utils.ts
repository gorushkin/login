type ClassNames = (string | true | false)[];

export const cn = (...classnames: ClassNames) => classnames.filter((item) => !!item).join(' ');
