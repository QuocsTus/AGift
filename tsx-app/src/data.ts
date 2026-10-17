import type { Occasion, OccasionMeta } from "./types";

export const occasions: Record<Occasion, OccasionMeta> = {
  birthday: {
    path: "/",
    label: "Sinh nhật",
    eyebrow: "Một ngày thật đặc biệt",
    title: "Chúc mừng sinh nhật cô",
    message:
      "Cảm ơn cô vì đã luôn dịu dàng gieo những hạt mầm xanh trong lòng mỗi học trò.",
  },
  october20: {
    path: "/20-10",
    label: "20/10",
    eyebrow: "Ngày Phụ nữ Việt Nam",
    title: "Chúc cô luôn rạng rỡ",
    message:
      "Chúc cô luôn bình an, hạnh phúc và nhận thật nhiều yêu thương trong ngày đặc biệt này.",
  },
  november20: {
    path: "/20-11",
    label: "20/11",
    eyebrow: "Ngày Nhà giáo Việt Nam",
    title: "Tri ân người gieo mầm",
    message:
      "Cảm ơn cô đã kiên nhẫn gieo những hạt mầm tri thức và yêu thương trong mỗi thế hệ học trò.",
  },
};

export const memories = [
  {
    title: "Những bài học đầu tiên",
    image: "/anh-baihoc-1.png",
    text: "Từng bài học nhỏ đã mở ra một thế giới thật lớn.",
  },
  {
    title: "Khoảnh khắc thân thương",
    image: "/anh-khoanhkhac-1.png",
    text: "Có những kỷ niệm càng đi xa càng thấy quý giá.",
  },
  {
    title: "Hành trình xanh",
    image: "/anh-hanhtrinh-1.png",
    text: "Cô luôn là người lặng lẽ đồng hành phía sau.",
  },
];
