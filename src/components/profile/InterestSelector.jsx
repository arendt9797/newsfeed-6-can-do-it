/* eslint-disable react/prop-types */
import { toggleInterest } from '../../shared/utils/categoryUtils';
import categories from '../../constants/categories';
import { StCategoryButton } from '../../styles/ProfileStyles';

function InterestSelector({ selectedInterests, setSelectedInterests }) {

  return (
    <div className="categories">
      <p>{'⭐ 관심 카테고리 (최대 3개 선택)'}</p>
      {categories.map((category) => (
        <StCategoryButton
          key={category}
          type="button"
          onClick={() => {
            toggleInterest(category, setSelectedInterests, selectedInterests);
          }}
          selected={selectedInterests.includes(category)}
        >
          {category}
        </StCategoryButton>
      ))}
    </div>
  );
}

export default InterestSelector;
