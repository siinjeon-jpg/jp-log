import type { PrefectureName, PrefectureSlug } from "@/lib/prefectures";

export type JapanMapLabelAnchor = "start" | "middle" | "end";

export type JapanMapHotspot = {
  slug: PrefectureSlug;
  label: PrefectureName;
  cx: number;
  cy: number;
  r: number;
  labelX: number;
  labelY: number;
  labelAnchor?: JapanMapLabelAnchor;
  labelLine?: string;
};

export const JAPAN_MAP_HOTSPOTS: JapanMapHotspot[] = [
  {
    slug: "hokkaido",
    label: "홋카이도",
    cx: 494,
    cy: 102,
    r: 18,
    labelX: 494,
    labelY: 144
  },
  {
    slug: "tokyo",
    label: "도쿄",
    cx: 542,
    cy: 262,
    r: 16,
    labelX: 588,
    labelY: 252,
    labelAnchor: "start",
    labelLine: "M556 259 L581 252"
  },
  {
    slug: "kyoto",
    label: "교토",
    cx: 358,
    cy: 305,
    r: 15,
    labelX: 324,
    labelY: 286,
    labelAnchor: "end",
    labelLine: "M344 298 L329 289"
  },
  {
    slug: "osaka",
    label: "오사카",
    cx: 336,
    cy: 337,
    r: 15,
    labelX: 290,
    labelY: 357,
    labelAnchor: "end",
    labelLine: "M322 344 L297 353"
  },
  {
    slug: "fukuoka",
    label: "후쿠오카",
    cx: 176,
    cy: 370,
    r: 18,
    labelX: 176,
    labelY: 425,
    labelLine: "M176 388 L176 412"
  },
  {
    slug: "okinawa",
    label: "오키나와",
    cx: 596,
    cy: 430,
    r: 16,
    labelX: 632,
    labelY: 422,
    labelAnchor: "start",
    labelLine: "M609 428 L626 422"
  }
];

export const JAPAN_SILHOUETTE_PATHS = {
  hokkaido:
    "M442 77 C459 57 493 48 525 53 C552 57 574 73 578 93 C582 115 569 136 543 148 C515 161 475 160 449 144 C424 128 420 101 442 77 Z",
  honshu:
    "M323 201 C350 182 394 173 438 174 C489 176 535 188 569 212 C592 229 605 250 603 268 C601 291 583 314 553 336 C525 356 490 372 464 391 C436 412 405 427 369 438 C334 449 295 445 268 424 C244 405 236 377 242 349 C249 319 270 289 294 261 C306 246 313 220 323 201 Z",
  kyushu:
    "M109 345 C130 327 164 320 194 325 C221 330 243 344 251 365 C261 389 252 416 228 434 C204 453 167 460 136 452 C107 444 84 423 81 397 C78 376 89 360 109 345 Z",
  okinawa:
    "M520 426 C542 415 572 411 599 415 C618 418 632 429 633 441 C634 455 624 468 607 476 C588 485 559 488 536 482 C515 476 502 465 501 452 C500 442 508 432 520 426 Z"
} as const;
