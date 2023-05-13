type ClassNames = (string | true | false)[];

export const cn = (...classnames: ClassNames) => classnames.filter((item) => !!item).join(' ');

const getId = () => {
  let i = 0;
  return () => {
    i += 1;
    return i;
  };
};

export const id = getId();


export class AppError extends Error {
  constructor(message: string) {
    super(message);
  }
}
