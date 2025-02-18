import { useEffect, useState, useContext } from 'react';
import { supabase } from '../supabase/client';
import { AuthContext } from '../context/AuthProvider';
import { handleImageChange, handleImageUpload } from '../shared/utils/fileUtils';
import { useValidation } from './useValidation';

export const useProfile = () => {
  const { isLogin } = useContext(AuthContext);
  const { errors, validateField, validateForm, setErrors } = useValidation();
  const [profile, setProfile] = useState({
    image_url: "",
    nickname: "",
    email: "",
    password: "",
    github: "",
    blog: "",
  });
  const [image, setImage] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!isLogin) return;
    fetchUserProfile();
    fetchUserInterests();
  }, [isLogin]);

  // 1. 사용자 프로필 정보를 가져오는 함수
  const fetchUserProfile = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const userId = authData.user.id;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("nickname, github, blog, my_profile_image_url")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      setProfile((prev) => ({
        ...prev,
        id: userId,
        nickname: userData.nickname,
        email: authData.user.email,
        github: userData.github,
        blog: userData.blog,
        my_profile_image_url: userData.my_profile_image_url,
      }));

      setPreview(userData.my_profile_image_url);
    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
    }
  };
  // 2. 사용자의 관심사 목록을 가져오는 함수
  const fetchUserInterests = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user.id;

      const { data: interestData, error: interestError } = await supabase
        .from("user_interests")
        .select("user_interest")
        .eq("user_id", userId);

      if (interestError) throw interestError;

      setSelectedInterests(interestData.map((item) => item.user_interest));
    } catch (error) {
      console.error("관심사 정보 불러오기 실패:", error);
    }
  };
  // 3. 사용자의 관심사를 업데이트하는 함수
  const updateUserInterests = async () => {
    try {
      await supabase.from("user_interests").delete().eq("user_id", profile.id);
      await supabase
        .from("user_interests")
        .insert(selectedInterests.map((category) => ({
          user_id: profile.id,
          user_interest: category
        })));
    } catch (error) {
      console.error("관심사 업데이트 실패:", error);
      throw error;
    }
  };
  // 4. 사용자의 비밀번호를 업데이트하는 함수//
  const updateUserPassword = async () => {
    if (!profile.password) return;
    try {
      await supabase.auth.updateUser({ password: profile.password });
    } catch (error) {
      console.error("비밀번호 업데이트 실패:", error);
      throw error;
    }
  };
  // 5. 사용자 프로필 정보를 업데이트하는 함수//
  const updateUserProfile = async (imageUrl) => {
    try {
      await supabase
        .from("users")
        .update({
          nickname: profile.nickname,
          github: profile.github,
          blog: profile.blog,
          my_profile_image_url: imageUrl,
        })
        .eq("id", profile.id);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      throw error;
    }
  };
  // 프로필 업데이트 처리 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("입력 필드를 확인해주세요.");
      return;
    }

    try {
      const imageUrl = await handleImageUpload(image, profile);
      if (imageUrl) {
        setProfile((prev) => ({ ...prev, my_profile_image_url: imageUrl }));
        setPreview(imageUrl);
      }

      await Promise.all([
        updateUserProfile(imageUrl),
        updateUserInterests(),
        updateUserPassword()
      ]);
      alert("프로필 업데이트 완료!");

      window.location.reload();
    } catch (error) {
      console.error("프로필 업데이트에 실패", error);
    }
  };

  // 입력값 변경시 실행되는 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  return {
    profile,
    errors,
    selectedInterests,
    setSelectedInterests,
    setImage,
    setPreview,
    preview,
    handleSubmit,
    handleChange,
    handleImageChange,
  };
};