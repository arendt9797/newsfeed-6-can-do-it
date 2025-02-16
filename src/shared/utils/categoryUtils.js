  // 내 관심 카테고리 선택
export const toggleInterest = (category, setSelectedInterests) => {
    setSelectedInterests((prev) => {
      if (prev.includes(category)) {
        return prev.filter((selected) => selected !== category);
      } else if (prev.length < 3) {
        return [...prev, category];
      } else {
        alert("관심사는 최대 3개까지 선택할 수 있습니다.");
        return prev;
      }
    });
  };