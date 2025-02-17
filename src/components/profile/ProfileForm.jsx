/* eslint-disable react/prop-types */
import ProfileImageUploader from './ProfileImageUploader';
import InterestSelector from './InterestSelector';
import { StSubmitButton } from '../../styles/ProfileStyles';

function ProfileForm({
  profile,
  errors,
  selectedInterests,
  setSelectedInterests,
  preview,
  setImage,
  setPreview,
  onSubmit,
  onChange,
}) {
  return (
    <form onSubmit={onSubmit}>
      <ProfileImageUploader
        preview={preview}
        setImage={setImage}
        setPreview={setPreview}
      />

      <div className="user-info">
        <div>
          <p>{'E-mail'}</p>
          <input type="email" name="email" value={profile.email} readOnly />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div>
          <p>{'Nickname'}</p>
          <input
            type="text"
            name="nickname"
            value={profile.nickname}
            onChange={onChange}
          />
          {errors.nickname && <span className="error-message">{errors.nickname}</span>}
        </div>

        <div>
          <p>{'Password'}</p>
          <input
            type="password"
            name="password"
            value={profile.password || ""}
            placeholder="비밀번호를 변경할 경우에만 입력하세요"
            onChange={onChange}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div>
          <p>{'Github'}</p>
          <input
            type="url"
            name="github"
            value={profile.github || ""}
            onChange={onChange}
          />
          {errors.github && <span className="error-message">{errors.github}</span>}
        </div>

        <div>
          <p>{'Blog'}</p>
          <input
            type="url"
            name="blog"
            value={profile.blog || ""}
            onChange={onChange}
          />
          {errors.blog && <span className="error-message">{errors.blog}</span>}
        </div>
      </div>

      <InterestSelector
        selectedInterests={selectedInterests}
        setSelectedInterests={setSelectedInterests}
      />

      <StSubmitButton type="submit">수정완료</StSubmitButton>
    </form>
  );
}

export default ProfileForm;