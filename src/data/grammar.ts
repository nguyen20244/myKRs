import { GrammarEntry } from "../types/grammar.types";

export const INITIAL_GRAMMAR: GrammarEntry[] = [
  {
    pattern: "N은/는 N이에요/예요",
    meaning_vi: "Là...",
    usage_vi: "Dùng để chỉ thuộc tính của đối tượng và biến nó thành vị ngữ.",
    formula: "N + 은/는 + N + 이에요/예요",
    examples: [
      { kr: "저는 회사원이에요.", vi: "Tôi là nhân viên công ty." },
      { kr: "이것은 잡지예요.", vi: "Cái này là tạp chí." }
    ],
    level: 1,
    detect: ["이에요", "예요"]
  },
  {
    pattern: "V-고 싶다",
    meaning_vi: "Muốn...",
    usage_vi: "Diễn tả nguyện vọng, mong muốn của người nói.",
    formula: "V + 고 싶다",
    examples: [{ kr: "커피를 마시고 싶어요.", vi: "Tôi muốn uống cà phê." }],
    level: 1,
    detect: ["고 싶어", "고 싶다"]
  },
  {
    pattern: "V-으세요/세요",
    meaning_vi: "Hãy...",
    usage_vi: "Đưa ra mệnh lệnh hoặc lời khuyên lịch sự.",
    formula: "V + 으세요/세요",
    examples: [{ kr: "여기에 앉으세요.", vi: "Hãy ngồi ở đây." }],
    level: 1,
    detect: ["으세요", "세요"]
  },
  {
    pattern: "N이/가",
    meaning_vi: "Trợ từ chủ ngữ",
    usage_vi: "Chỉ danh từ đứng trước là chủ ngữ của câu.",
    formula: "N + 이/가",
    examples: [{ kr: "동생이 자요.", vi: "Em tôi ngủ." }],
    level: 1,
    detect: ["이", "가"]
  },
  {
    pattern: "N에 있어요/없어요",
    meaning_vi: "Có ở/ Không có ở",
    usage_vi: "Chỉ vị trí hoặc sự tồn tại của người, sự vật.",
    formula: "N + 에 + 있다/없다",
    examples: [
      { kr: "교실에 학생이 있어요.", vi: "Trong phòng học có học sinh." },
      { kr: "지갑에 돈이 없어요.", vi: "Trong ví không có tiền." }
    ],
    level: 1,
    detect: ["에 있어", "에 없어", "에 있습", "에 없습"]
  },
  {
    pattern: "V-았/었/였어요",
    meaning_vi: "Đã...",
    usage_vi: "Diễn tả hành động hoặc trạng thái đã diễn ra trong quá khứ.",
    formula: "V + 았/었/였어요",
    examples: [{ kr: "어제 영화를 봤어요.", vi: "Hôm qua tôi đã xem phim." }],
    level: 1,
    detect: ["았어요", "었어요", "였어요", "했습니다"]
  },
  {
    pattern: "N(이)나 / V-거나",
    meaning_vi: "Hoặc là...",
    usage_vi: "Sử dụng khi chọn một trong hai đối tượng hoặc hành động.",
    formula: "N + (이)나 / V + 거나",
    examples: [
      { kr: "빵이나 김밥을 먹어요.", vi: "Tôi ăn bánh mì hoặc kimbap." },
      { kr: "주말에 잠을 자거나 책을 읽어요.", vi: "Cuối tuần tôi ngủ hoặc đọc sách." }
    ],
    level: 2,
    detect: ["이나", "거나"]
  },
  {
    pattern: "N-밖에",
    meaning_vi: "Chỉ..., ngoài... ra thì không",
    usage_vi: "Sử dụng với nghĩa tiêu cực, nhấn mạnh số lượng hoặc mức độ ít ỏi.",
    formula: "N + 밖에 + Phủ định (không/không thể)",
    examples: [{ kr: "교실에 학생이 한 명밖에 없어요.", vi: "Trong lớp học chỉ có đúng một học sinh." }],
    level: 2,
    detect: ["밖에 없어", "밖에 안"]
  },
  {
    pattern: "V-(으)니까",
    meaning_vi: "Vì..., nên...",
    usage_vi: "Diễn tả nguyên nhân, lý do. Thường dùng trong câu mệnh lệnh hoặc đề nghị.",
    formula: "V + (으)니까",
    examples: [{ kr: "날씨가 좋으니까 산책합시다.", vi: "Vì thời tiết đẹp nên chúng ta hãy đi dạo đi." }],
    level: 2,
    detect: ["니까", "으니까"]
  }
];
