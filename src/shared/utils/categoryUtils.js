import { toast } from "react-toastify";

// 내 관심 카테고리 선택
export const toggleInterest = (
  category,
  setSelectedInterests,
  selectedInterests,
) => {
  if (selectedInterests.length >= 3 && !selectedInterests.includes(category)) {
    toast.info('카테고리 3개를 선택해주세요.');
    return; 
  }
  setSelectedInterests((prev) => {
    if (prev.includes(category)) {
      return prev.filter((selected) => selected !== category);
    } else {
      return [...prev, category];
    }
  });
};
