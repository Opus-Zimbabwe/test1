export const HERO_PATHS = {
  embrace:
    "M .12 0 C .34 .10 .03 .22 .16 .38 C .31 .55 .02 .63 .05 .80 C .08 .91 .19 .97 .12 1 C .12 1 .12 1 .12 1 L 1 1 L 1 0 Z",
  diagonal:
    "M .42 0 C .35 .13 .21 .25 .15 .39 C .09 .53 .05 .66 .02 .79 C .00 .90 .06 .97 .12 1 C .12 1 .12 1 .12 1 L 1 1 L 1 0 Z",
  arch: "M .50 0 C .10 .04 .02 .30 .02 .46 C .02 .62 .02 .70 .02 .80 C .02 .91 .02 .96 .02 1 C .02 1 .02 1 .02 1 L 1 1 L 1 0 Z",
  ribbon:
    "M .18 0 C .07 .17 .45 .15 .34 .37 C .23 .59 .02 .54 .07 .79 C .10 .92 .30 .96 .17 1 C .17 1 .17 1 .17 1 L 1 1 L 1 0 Z",
};

// Keep faces clear on mobile while the lower edge morphs smoothly.
export const MOBILE_HERO_PATHS = {
  embrace: "M 0 0 L 1 0 L 1 .86 C .85 .91 .87 1 .68 1 C .43 1 .18 .98 0 .86 L 0 0 Z",
  diagonal: "M 0 0 L 1 0 L 1 .78 C .83 .82 .79 .89 .65 .92 C .42 .99 .20 1 0 1 L 0 0 Z",
  arch: "M 0 0 L 1 0 L 1 1 C .78 1 .62 .99 .48 .92 C .29 .82 .14 .80 0 .84 L 0 0 Z",
  ribbon: "M 0 0 L 1 0 L 1 .88 C .79 .98 .69 1 .52 .92 C .31 .81 .17 .91 0 .98 L 0 0 Z",
};

// Matching cubic segments keep the heart transition continuous.
export const HEART_HERO_PATH =
  "M .50 .20 C .20 0 .02 .02 .02 .28 C .02 .55 .30 .80 .50 .96 C .70 .80 .98 .55 .98 .28 C .98 .02 .80 0 .50 .20 L .50 .20 L .50 .20 Z";
export const MOBILE_HEART_HERO_PATH =
  "M 0 0 L 1 0 L 1 .78 C .88 .87 .66 .96 .50 1 C .34 .96 .12 .87 0 .78 L 0 0 Z";
