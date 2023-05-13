type ClassNames = (string | true | false)[];

const REDIRECT_PAGE = 'http://www.w3schools.com'

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

export const startTimer = (initTimer: number, cb: (n: number) => void) => {
  const updateTimer = (n: number) => {
    cb(n);
    if (n === 0) return window.location.href = REDIRECT_PAGE;
    setTimeout(() => {
      updateTimer(n - 1);
    }, 1000);
  };

  updateTimer(initTimer);
};
