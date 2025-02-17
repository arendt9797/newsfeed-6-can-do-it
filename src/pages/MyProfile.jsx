import { useProfile } from '../hooks/useProfile';
import ProfileForm from '../components/profile/ProfileForm';
import { StMyProfile, StMyProfileContainer } from '../styles/ProfileStyles';

function MyProfile() {
  const { 
    profile,
    errors,
    selectedInterests,
    preview,
    setImage,
    setPreview,
    setSelectedInterests,
    handleSubmit,
    handleChange,
    handleImageChange,
  } = useProfile();

  return (
    <StMyProfile>
      <StMyProfileContainer>
        <ProfileForm
          profile={profile}
          errors={errors}
          selectedInterests={selectedInterests}
          setSelectedInterests={setSelectedInterests}
          setImage={setImage}
          setPreview={setPreview}
          preview={preview}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onImageChange={handleImageChange}
        />
      </StMyProfileContainer>
    </StMyProfile>
  );
}

export default MyProfile;